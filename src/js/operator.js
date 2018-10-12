import { api } from '/api';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import { warehouse } from '/warehouse';
import { router } from '/router';
import { getMessageContent, isDMStation } from '/lib/util';
import { REPORT_PAGE_STATUS, PAGE_STATUS_DISCONNECTED, PAGE_STATUS_READY } from '/lib/constants';

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
      let xenoStation = details.content;

      // TODO: Don't fire this if the invite has already been accepted.
      if (details.type === "inv" &&
          isDMStation(xenoStation)) {

        let cir = xenoStation.split("/")[1];
        this.props.api.hall({
          newdm: {
            sis: cir.split(".")
          }
        });
      }
    })
  }

  bindQuietDmInvites() {
    // Automatically accept DM invite messages
    warehouse.pushCallback('circles', rep => {
      warehouse.pushCallback('circle.gram', (rep) => {
        this.quietlyAcceptDmInvites([rep.data.gam]);

        return false;
      })

      warehouse.pushCallback('circle.nes', (rep) => {
        this.quietlyAcceptDmInvites(rep.data.map(m => m.gam));

        return false;
      })

      return true;
    });
  }

  bindShortcuts() {
    Mousetrap.bind(["mod+k"], () => {
      warehouse.storeReports([{
        type: "menu.toggle"
      }]);
    });
  }

  initializeLandscape() {
    // owner's circles
    api.bind(`/circles/~${api.authTokens.ship}`, "PUT");

    warehouse.pushCallback('circles', rep => {
      // inbox local + remote configs, remote presences
      api.bind("/circle/inbox/config/group-r/0", "PUT");

      // inbox messages
      api.bind("/circle/inbox/grams/-50", "PUT");
      api.bind("/circle/i/grams/0", "PUT");

      // this.createAndBindAggregators();

      return true;
    });

    // grab the config for the root collection circle
    // api.bind("/circle/c/config/group-r/0", "PUT");

    // parses client-specific info (ship nicknames, glyphs, etc)
    // this.bind("/client", "PUT");

    // public membership
    api.bind("/public", "PUT");

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
        } else if (data.type === "quit") {
          console.log("rebinding: ", data);
          api.bind(data.from.path, "PUT", data.from.ship, data.from.appl);
          this.seqn++;
          this.runPoll();
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
