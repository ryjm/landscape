import { api } from '/api';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import { warehouse } from '/warehouse';
import { router } from '/router';
import { getMessageContent, isDMStation } from '/lib/util';
import { REPORT_PAGE_STATUS, PAGE_STATUS_DISCONNECTED, PAGE_STATUS_READY, INBOX_MESSAGE_COUNT } from '/lib/constants';
import urbitOb from 'urbit-ob';

const LONGPOLL_TIMEOUT = 10000;
const LONGPOLL_TRYAGAIN = 30000;

/**
  Response format

  {
    data: {
      json: {
        circle: {   // *.loc for local, *.rem for remote
          cos:      // config
          pes:      // presence
          nes:      // messages
          gram:     // message (individual)
        }
        circles:    // circles you own
        public:     // circles in your public membership list
        client: {
          gys:      // glyphs
          nis:      // nicknames
        }
        peers:      // subscribers to your circles
        status:     // rumor, presence -- TODO?
      }
    }
    from: {
      path:    // Subscription path that triggered response
      ship:    // Subscription requestor
    }
  }
**/

export class UrbitOperator {
  constructor() {
    this.seqn = 1;
  }

  start() {
    if (api.authTokens) {
      this.runPoll();
      this.initializeLandscape();
      this.bindShortcuts();
      this.setCleanupTasks();
    } else {
      console.error("~~~ ERROR: Must set api.authTokens before operation ~~~");
    }
  }

  setCleanupTasks() {
    window.addEventListener("beforeunload", e => {
      api.bindPaths.forEach(p => {
        this.wipeSubscription(p);
      });
    });
  }

  wipeSubscription(path) {
    api.hall({
      wipe: {
        sub: [{
          hos: api.authTokens.ship,
          pax: path
        }]
      }
    });
  }

  quietlyAcceptDmInvites(msgs) {
    msgs.forEach(msg => {
      let details = getMessageContent(msg);
      if (details.type === "inv") {
        let xenoStation = details.content.cir;
        // TODO: Don't fire this if the invite has already been accepted.

        if (isDMStation(xenoStation)) {
          let xenoCir = xenoStation.split("/")[1];

          let existingDMStation = _.find(Object.keys(warehouse.store.configs), station => {
            let host = station.split("/")[0];
            let cir = station.split("/")[1];

            return (host === `~${api.authTokens.ship}` && cir === xenoCir)
          });

          if (!existingDMStation) {
            api.hall({
              newdm: {
                sis: xenoCir.split(".")
              }
            });
          }
        }
      }
    })
  }

  bindShortcuts() {
    Mousetrap.bind(["mod+k"], () => {
      warehouse.storeReports([{
        type: "menu.toggle"
      }]);
    });
  }

  eagerFetchExtConfs() {
    Object.keys(warehouse.store.configs).forEach(station => {
      let stationDetails = getStationDetails(station);
      let isCollection = ['collection-post', 'collection-index'].includes(stationDetails.type);
      let noExtConf = !warehouse.store.configs[station].extConf;
      if (isCollection && noExtConf) {
        fetch(`${stationDetails.stationUrl}.x-collections-json`, {
          credentials: "same-origin",
        }).then(res => {
          return res.json();
        }).then(extConfJson => {
          console.log('extConf = ', extConfJson);
          let collName;
          if (extConfJson.item) {
            collName = extConfJson.item.meta.name;
          } else {
            collName = extConfJson.collection.meta.name;
          }

          warehouse.storeReports([{
            type: "config.ext",
            data: { station, extConf: { name: collName } }
          }])
        });
      }
    })
  }

  initializeLandscape() {
    // first step: bind to owner's circles
    api.bind(`/circles/~${api.authTokens.ship}`, "PUT");

    warehouse.pushCallback('circles', rep => {
      // inbox local + remote configs, remote presences
      api.bind("/circle/inbox/config/group-r", "PUT");

      // inbox messages
      api.bind(`/circle/inbox/grams/-${INBOX_MESSAGE_COUNT}`, "PUT");

      // bind to invite circle (shouldn't be subscribed to inbox)
      api.bind("/circle/i/grams/-999", "PUT");

      warehouse.pushCallback(['circle.gram', 'circle.nes'], (rep) => {
        let circle = rep.from.path.split('/')[2];

        // do nothing with gram binds to foreign ships
        if (urbitOb.isShip(circle)) return;

        // Any message comes in to the /i circle
        if (circle === "i") {
          let msgs = rep.type === "circle.gram" ? [rep.data.gam] : rep.data.map(m => m.gam);
          this.quietlyAcceptDmInvites(msgs);
        }

        let lastReadNum;
        if (_.isArray(rep.data) && rep.data.length > 0) {
          lastReadNum = _.nth(rep.data, -1).num;
        } else {
          lastReadNum = rep.data.num;
        }

        if (lastReadNum && warehouse.store.configs[`~${api.authTokens.ship}/${circle}`].lastReadNum < lastReadNum) {
          api.hall({
            read: {
              nom: circle,
              red: lastReadNum
            }
          });

          warehouse.storeReports([{
            type: "circle.read",
            data: {
              station: `~${api.authTokens.ship}/${circle}`,
              lastReadNum
            }
          }])
        }

        return false;
      })

      warehouse.pushCallback('circle.nes', (rep) => {
        // First batch of inbox messages has gotten in

        if (rep.from.path.includes("inbox")) {
          this.eagerFetchExtConfs();
          warehouse.storeReports([{
            type: REPORT_PAGE_STATUS,
            data: PAGE_STATUS_READY
          }]);
          return false;
        }
      });

      warehouse.pushCallback('circle.cos.loc', (rep) => {
        let fromCircle = rep.from && rep.from.path.split("/")[2];
        let fromInbox = fromCircle === "inbox";

        // this.wipeSubscription('/circle/inbox/config/group-r/0');

        if (fromInbox) {
          warehouse.storeReports([{
            type: "inbox.sources-loaded",
          }]);
        }

        return false;
      });

      return true;
    });

    // grab the config for the root collection circle
    // api.bind("/circle/c/config/group-r/0", "PUT");

    // parses client-specific info (ship nicknames, glyphs, etc)
    // this.bind("/client", "PUT");

    // public membership
    // api.bind("/public", "PUT");

    // bind to collections
    // this.bind("/", "PUT", "collections");

    // delete subscriptions when you're done with them, like...
    // this.bind("/circle/inbox/grams/0", "DELETE");
  }

  runPoll() {
    console.log('fetching... ', this.seqn);

    // const controller = new AbortController();
    // const signal = controller.signal;

    // const disconnectedTimeout = setTimeout(() => {
    //   controller.abort();
    //   warehouse.storeReports([{
    //     type: REPORT_PAGE_STATUS,
    //     data: PAGE_STATUS_DISCONNECTED
    //   }]);
    //   this.runPoll();
    // }, LONGPOLL_TIMEOUT);

    fetch(`/~/of/${api.authTokens.ixor}?poll=${this.seqn}`, {
      credentials: "same-origin",
      // signal: controller.signal
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        // warehouse.storeReports([{
        //   type: REPORT_PAGE_STATUS,
        //   data: PAGE_STATUS_READY
        // }]);

        // clearTimeout(disconnectedTimeout);

        if (data.beat) {
          console.log('beat');
          this.runPoll();
        // } else if (data.type === "quit") {
        //   console.log("rebinding: ", data);
        //   api.bind(data.from.path, "PUT", data.from.ship, data.from.appl);
        //   this.seqn++;
        //   this.runPoll();
        } else {
          console.log("new server data: ", data);

          if (data.data) {
            warehouse.storePollResponse(data);
          }

          this.seqn++;
          this.runPoll();
        }
      })
      .catch(error => {
        console.error('error = ', error);
        // warehouse.storeReports([{
        //   type: REPORT_PAGE_STATUS,
        //   data: PAGE_STATUS_DISCONNECTED
        // }]);
        //
        // clearTimeout(disconnectedTimeout);

        // TODO: Make this reconnect automatically
        // setTimeout(() => {
        //   this.runPoll();
        // }, LONGPOLL_TRYAGAIN);
      });
  }
}

export let operator = new UrbitOperator();
window.operator = operator;
