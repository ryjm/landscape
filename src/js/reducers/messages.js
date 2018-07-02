import _ from 'lodash';
import { getMessageContent, isDMStation } from '/lib/util';

const INBOX_MESSAGE_COUNT = 30;

export class MessagesReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      let fromInbox = rep.from && rep.from.path.includes("inbox");

      switch (rep.type) {
        case "circle.nes":
          this.processMessages(rep.data, store, fromInbox);
          break;
        case "circle.gram":
          this.processMessages([rep.data], store, fromInbox);
          break;
        case "circle.config.dif.remove":
          delete store.messages.stations[rep.data.cir];
          break;
        case "circle.config.dif.source":
          if (fromInbox && !rep.data.add) {
            this.removeInboxMessages(rep.data.src, store);
          }
      }
    });
  }

  processMessages(messages, store, fromInbox) {
    this.storeStationMessages(messages, store);
    if (fromInbox) {
      this.storeInboxMessages(messages, store);
    }
  }

  // TODO:  Make this more like storeInboxMessages
  storeStationMessages(messages, store) {
    messages.forEach((message) => {
      let msg = message.gam;
      msg.aud.forEach((aud) => {
        let station = store.messages.stations[aud];

        if (!station) {
          store.messages.stations[aud] = [msg];
        } else if (station.findIndex(o => o.uid === msg.uid) === -1) {
          let newest = true;

          for (let i = 0; i < station.length; i++) {
            if (msg.wen < station[i].wen) {
              station.splice(i, 0, msg);
              newest = false;
              break;
            }
          }

          if (newest) station.push(msg);

          // Print messages by date, for debugging:
          // for (let msg of station.messages) {
          //   console.log(`msg ${msg.uid}: ${msg.wen}`);
          // }
        }
      })
    });
  }

  storeInboxMessages(messages, store) {
    let msgGams = messages
      .map(m => m.gam)                  // grab the gam

    let ret = _(store.messages.inboxMessages)
      .slice()                          // make a shallow copy
      .concat(msgGams)                  // add new messages
      .sort((a, b) => b.wen - a.wen)    // sort by date
      // sort must come before uniqBy! if uniqBy detects a dupe, it takes
      // earlier element in the array. since we want later timestamps to
      // override, sort first
      .uniqBy('uid')                    // dedupe
      .filter(m => {
        let msgDetails = getMessageContent(m);
        let typeApp = msgDetails.type === "app";
        let typeInv = msgDetails.type === "inv";
        let isDmInvite = typeInv && isDMStation(msgDetails.content);
        let hasResponded = msgDetails.content === "~zod/null";

        if (typeApp) return false;
        if (isDmInvite) return false;
        if (typeInv && hasResponded) return false;

        return true;
      })                                // filter out messages
      .slice(0, INBOX_MESSAGE_COUNT)    // grab the first 30 or so
      .value();                         // unwrap lodash chain

    for (let msg of ret) {
      console.log(`msg ${msg.uid}: ${msg.wen}`);
    }

    store.messages.inboxMessages = ret;
  }

  removeInboxMessages(station, store) {
    store.messages.inboxMessages = store.messages.inboxMessages.filter((msg) => !msg.aud.includes(station))
  }
}
