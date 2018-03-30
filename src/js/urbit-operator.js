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
    api.bind("/circle/inbox/grams/0/500", "PUT");

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

  /*
  // BS stands for "bulletin service"
 parseBS(bs) {
   return {
     configs: this.parseInboxConfigs(bs),
     messages: this.parseInboxMessages(bs),
     ownedStations: this.parseOwnedStations(bs) // discard this result for now, just call it for side effects.
   }
 }

 parseInboxMessages(bs) {
   let messages = [];

   let pathTokens = bs.from.path.split("/");

   if (pathTokens[1] === "circle"
    && pathTokens[2] === "inbox"
    && pathTokens[3] === "grams") {

     let circle = bs.data.json.circle;
     if (circle.nes) {
       // Add inbox messages
       messages = circle.nes.map(m => m.gam);
     }

     if (circle.gram) {
       // Add single message
       messages = [circle.gram.gam];
     }
   }

   return messages.map(m => {

     // Remove ~ship/inbox from audiences if they exist
     // TODO:  This is legacy from old web talk. In general we should perhaps
     // drop chat messages addressed directly to inbox (?)
     let i = m.aud.indexOf(`~${this.authTokens.ship}/inbox`);
     if (i !== -1 && m.aud.length > 1) {
       m.aud.splice(i, 1);
     }

     // flatten msg.sep.app into msg
     // TODO:  Bake this into Hall api response if possible
     if (m.sep.app) {
       m.sep = m.sep.app.sep;
       m.app = true;
       m.aut = "rob";
     }

     return m;
   });
 }

 parseInboxConfigs(bs) {
   console.log('bs...', bs);

   let configs = {}

   let pathTokens = bs.from.path.split("/");

   if (pathTokens[1] === "circle"
    && pathTokens[2] === "inbox"
    && pathTokens[3] === "config") {

     let circle = bs.data.json.circle;

     // add new created station to inbox's configs
     if (circle.config && circle.config.dif && circle.config.dif.full) {
       console.log('circle circle.config.dif.full', circle.config.cir);
       configs[circle.config.cir] = circle.config.dif.full;
     }

     // add or remove src from a circle
     if (circle.config && circle.config.dif && circle.config.dif.source) {
       console.log('circle circle.config.dif.source', circle.config.cir);
       configs[circle.config.cir] = circle.config.dif.source;
     }

     // add to config blacklist or whitelist
     if (circle.config && circle.config.dif && circle.config.dif.permit) {
       console.log('circle circle.config.dif.full', circle.config.cir);

       configs[circle.config.cir] = configs[circle.config.cir] || {};
       configs[circle.config.cir].permit = circle.config.dif.permit;
     }

     // Add inbox config
     if (circle.cos && circle.cos.loc) {
       let inbox = `~${this.authTokens.ship}/inbox`;
       configs[inbox] = circle.cos.loc;
     }

     // Add remote configs
     if (circle.cos && circle.cos.rem) {
       // TODO: Do .rem's nest infinitely? Can I keep going here if there's a chain of subscriptions?
       Object.keys(circle.cos.rem).forEach((remConfig) => {
         configs[remConfig] = circle.cos.rem[remConfig];
       });
     }

     // Add remote presences
     //if (circle.pes && circle.pes.rem) {
     //  Object.keys(circle.pes.rem).forEach((pes) => {
     //    configs[pes].pes = circle.pes.rem[pes];
     //  });
     //}

     // For all the new configs, if there are pending invites for them, send the invites
     Object.keys(configs).forEach(cos => {
       this.warehouse.store.pendingInvites.forEach(inv => {
         // TOOD:  Maybe we should also check the invitees are in config.sis list, if whitelist
         debugger

         if (cos.indexOf(inv.nom) !== -1) {
           console.log('hi');
           this.hall({
             permit: {
               nom: inv.nom,
               sis: inv.aud,
               inv: true
             }
           });

           let audInboxes = inv.aud.map((aud) => `~${aud}/inbox`);
           console.log('inboxes = ', audInboxes);

           let message = {
             uid: uuid(),
             aud: audInboxes,
             aut: this.props.store.usership,
             wen: Date.now(),
             sep: {
               inv: {
                 inv: true,
                 circle: `${this.props.store.usership}/${inv.nom}`
               }
             }
           };

           this.props.api.hall({
             convey: [message]
           });
         }
       });

       this.warehouse.store.pendingInvites = [];
     })
   }

   return configs;
 }

 parseOwnedStations(bs) {
   let pathTokens = bs.from.path.split("/");

   if (pathTokens[1] === "circles"
    && pathTokens[2] === `~${this.authTokens.ship}`) {

     let ownedStations = bs.data.json.circles;

     if (ownedStations.cir && ownedStations.add) {
       console.log('does this actually work?');
       this.hall({
         source: {
           nom: `inbox`,
           sub: ownedStations.add,
           srs: [`~${this.authTokens.ship}/${ownedStations.cir}`]
         }
       });
     }
   }

   return [];
 }

 // processSideEffects() {
   // this.subscribeToOwnedStations();
 // }

 // subscribeToOwnedStations() {
 //   let {ownedStations, configs} = this.warehouse.store;
 //   let pendingStations = [];
 //
 //   console.log('ownedStations = ', ownedStations);
 //
 //   ownedStations.forEach(station => {
 //     if (!configs[station]) {
 //       pendingStations.push(`${this.authTokens.ship}/${station}`);
 //     }
 //   });
 //
 //   if (pendingStations.length > 0) {
 //     this.hall({
 //       source: {
 //         nom: `~${this.authTokens.ship}/inbox`,
 //         sub: true,
 //         srs: [pendingStations]
 //       }
 //     });
 //   }
 // }
 */
}
