import { api } from './urbit-api';
import { Reports } from './urbit-reports';
import _ from 'lodash';

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
  constructor(warehouse) {
    this.seqn = 1;
    this.warehouse = warehouse;

    this.runPoll();
    this.bindInbox();
  }

  bindInbox() {
    // inbox local + remote configs, remote presences
    api.bind("/circle/inbox/config/group-r/0", "PUT");

    // inbox messages
    api.bind("/circle/inbox/grams/-50", "PUT");

    // owner's circles
    api.bind(`/circles/~${api.authTokens.ship}`, "PUT");

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
            const hallReports = this.extractReports(data);
          }

          this.seqn++;
          this.runPoll();
        }
    });
  }

  extractReports(serverData) {
    let reports = [];
    let reportTypes = Object.keys(Reports);
    let json = serverData.data.json;

    reportTypes.forEach((type) => {
      let reportData = _.get(json, type, null);
      if (!_.isEmpty(reportData)) {

        // TODO: Awful, ugly hack. Maybe fix this with API discussion.
        if (Reports[type].include) {
          reportData = _.get(json, Reports[type].include, null);
        }

        reports.push({
          type: type,
          data: reportData,
          from: serverData.from
        });
      }
    });

    reports.forEach((rep) => console.log('new report: ', rep));

    this.warehouse.storeReports(reports);
  }
}
