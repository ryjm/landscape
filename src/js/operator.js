import { api } from '/api';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import { warehouse } from '/warehouse';
import { router } from '/router';
import { getMessageContent, isDMStation } from '/lib/util';
import { createDMStation } from '/services';

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
      this.bindInbox();
      this.bindShortcuts();
      this.bindOperations();
    } else {
      console.error("~~~ ERROR: Must set api.authTokens before operation ~~~");
    }
  }

  quietlyAcceptDmInvites(msgs) {
    msgs.forEach(msg => {
      let details = getMessageContent(msg);
      let xenoStation = details.content;

      if (details.type === "inv" &&
          isDMStation(xenoStation) &&
          xenoStation !== "~zod/null") {

        let circle = xenoStation.split("/")[1];

        if (!warehouse.store.dms.stations.includes(circle)) {
          createDMStation(xenoStation, true);

          let newSep = {
            sep: {
              inv: {
                inv: true,
                cir: "~zod/null"
              }
            }
          };

          api.hall({convey: [{
            ...msg,
            ...newSep
          }]});
        }
      }
    })
  }

  bindOperations() {
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

  bindInbox() {
    // owner's circles
    api.bind(`/circles/~${api.authTokens.ship}`, "PUT");

    warehouse.pushCallback('circles', rep => {
      // inbox local + remote configs, remote presences
      api.bind("/circle/inbox/config/group-r/0", "PUT");

      // inbox messages
      api.bind("/circle/inbox/grams/-50", "PUT");

      return true;
    });

    // parses client-specific info (ship nicknames, glyphs, etc)
    // this.bind("/client", "PUT");

    // public membership
    // this.bind("/public", "PUT");

    // bind to collections
    // this.bind("/", "PUT", "collections");

    // delete subscriptions when you're done with them, like...
    // this.bind("/circle/inbox/grams/0", "DELETE");
  }

  runPoll() {
    console.log('fetching... ', this.seqn);
    fetch(`/~/of/${api.authTokens.ixor}?poll=${this.seqn}`, {credentials: "same-origin"})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.beat) {
          console.log('beat');
          this.runPoll();
        } else {
          console.log("new server data: ", data);

          if (data.data) {
            warehouse.storePollResponse(data);
          }

          this.seqn++;
          this.runPoll();
        }
    });
  }
}

export let operator = new UrbitOperator();
