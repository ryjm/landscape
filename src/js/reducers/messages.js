import _ from 'lodash';

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
            removeInboxMessages(rep.data.src, store);
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

    let ret = store.messages.inboxMessages
      .slice()                          // make a shallow copy
      .concat(msgGams)                  // add new messages
      .uniq('uid')                      // dedupe
      .sort((a, b) => b.wen - a.wen)    // sort by date
      .slice(0, INBOX_MESSAGE_COUNT);   // grab the first 30 or so

    // for (let msg of ret) {
    //   console.log(`msg ${msg.uid}: ${msg.wen}`);
    // }

    store.messages.inboxMessages = ret;
  }

  removeInboxMessages(station, store) {
    store.messages.inboxMessages = store.messages.inboxMessages.filter((msg) => !msg.aud.includes(station))
  }
}
