import _ from 'lodash';
import { getMessageContent, isDMStation, isRootCollection } from '/lib/util';

const INBOX_MESSAGE_COUNT = 30;

export class MessagesReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      let fromInbox = rep.from && rep.from.path.includes("inbox");
      switch (rep.type) {
        case "circle.nes":
          this.processMessages(rep.data, store);
          break;
        case "circle.gram":
          this.processMessages([rep.data], store);
          break;
        case "circle.config.dif.remove":
          delete store.messages.stations[rep.data.cir];
          break;
        case "circle.cos.loc":
          if (fromInbox) {
            store.messages.inboxSrc = rep.data.src.filter(s => !isRootCollection(s));
            this.storeInboxMessages(store);
          }
          break;
        case "circle.config.dif.source":
          if (fromInbox && !isRootCollection(rep.data.src)) {
            if (rep.data.add) {
              store.messages.inboxSrc = [...store.messages.inboxSrc, rep.data.src];
            } else {
              store.messages.inboxSrc = store.messages.inboxSrc.filter(src => src !== rep.data.src)
            }
            this.storeInboxMessages(store);
          }
          break;
      }
    });
  }

  processMessages(messages, store) {
    let msgs = messages.filter(m => {
      return !m.gam.aud.some(st => isRootCollection(st));
    });
    this.storeStationMessages(msgs, store);
    this.storeInboxMessages(store);
  }

  // TODO:  Make this more like storeInboxMessages
  storeStationMessages(messages, store) {
    messages.forEach((message) => {
      let msg = message.gam;
      msg.aud.forEach((aud) => {
        let msgClone = { ...msg, aud: [aud] };
        let station = store.messages.stations[aud]

        if (!station) {
          store.messages.stations[aud] = [msgClone];
        } else if (station.findIndex(o => o.uid === msgClone.uid) === -1) {
          let newest = true;

          for (let i = 0; i < station.length; i++) {
            if (msgClone.wen < station[i].wen) {
              station.splice(i, 0, msgClone);
              newest = false;
              break;
            }
          }

          if (newest) station.push(msgClone);

          // Print messages by date, for debugging:
          // for (let msgClone of station.messages) {
          //   console.log(`msgClone ${msg.uid}: ${msg.wen}`);
          // }
        }
      })
    });
  }

  storeInboxMessages(store) {
    let messages = store.messages.inboxSrc.reduce((msgs, src) => {
      let msgGroup = store.messages.stations[src];
      if (!msgGroup) return msgs;
      return msgs.concat(msgGroup.filter(this.filterInboxMessages));  // filter out app & accepted invite msgs
    }, []);

    let ret = _(messages)
      .sort((a, b) => b.wen - a.wen)    // sort by date
      // sort must come before uniqBy! if uniqBy detects a dupe, it takes
      // earlier element in the array. since we want later timestamps to
      // override, sort first
      .uniqBy('uid')                    // dedupe
      .slice(0, INBOX_MESSAGE_COUNT)    // grab the first 30 or so
      .value();                         // unwrap lodash chain
    // for (let msg of ret) {
    //   console.log(`msg ${msg.uid}: ${msg.wen}`);
    // }

    store.messages.inboxMessages = ret;
  }

  // Filter out of inbox:
  //   - app messages
  //   - accepted invites
  //   - all DM invites (should automatically accept)
  filterInboxMessages(msg) {
    let msgDetails = getMessageContent(msg);
    let typeApp = msgDetails.type === "app";
    let typeInv = msgDetails.type === "inv";
    let isDmInvite = typeInv && isDMStation(msgDetails.content);
    let hasResponded = typeInv && msgDetails.content === "~zod/null";

    if (typeApp) return false;
    if (isDmInvite) return false;
    if (hasResponded) return false;

    return true;
  }
}
