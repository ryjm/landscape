import _ from 'lodash';

const INBOX_MESSAGE_COUNT = 30;

export class MessagesReducer {
  reduce(reports, storeMessages) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case "circle.nes":
          this.processMessages(rep.data, storeMessages);
          break;
        case "circle.gram":
          this.processMessages([rep.data], storeMessages);
          break;
        case "circle.config.dif.remove":
          delete storeMessages[rep.data.cir];
          break;
      }
    });
  }

  processMessages(messages, storeMessages) {
    this.storeStationMessages(messages, storeMessages);
    this.storeInboxMessages(messages, storeMessages);
  }

  storeStationMessages(messages, storeMessages) {
    messages.forEach((message) => {
      let msg = message.gam;
      msg.aud.forEach((aud) => {
        let station = storeMessages.stations[aud];

        if (!station) {
          storeMessages.stations[aud] = [msg];
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

  storeInboxMessages(messages, storeMessages) {
    let msgGams = messages.map(m => m.gam)                  // grab the gam

    let ret = storeMessages.inboxMessages
      .slice()                          // make a shallow copy
      .concat(msgGams)                  // add new messages
      .uniq('uid')                      // dedupe
      .sort((a, b) => b.wen - a.wen)    // sort by date
      .slice(0, INBOX_MESSAGE_COUNT);   // grab the first 30 or so

    for (let msg of ret) {
      console.log(`msg ${msg.uid}: ${msg.wen}`);
    }

    storeMessages.inboxMessages = ret;
  }
}
