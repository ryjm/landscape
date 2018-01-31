// TODO: This being a class is an error, since UrbitReducer doesn't hold state. Export these as individual functions or bundle them some other way.
export class UrbitReducer {
  configs(newConfigs, storeConfigs) {
    Object.keys(newConfigs).forEach((cos) => {
      if (!storeConfigs[cos]) {
        storeConfigs[cos] = newConfigs[cos];
      }
    })

    return storeConfigs;
  }

  /*
    Messages are stored as a bucket of sorted messages inside individual stations for easy access later.
    Messages within stations are stored oldest-first.
  */
  messages(newMessages, storeMessages) {
    newMessages.forEach((newMsg) => {
      let station = storeMessages[newMsg.aud];

      if (!station) {
        storeMessages[newMsg.aud] = {
          name: newMsg.aud,
          messages: [newMsg]
        };
      } else if (station.messages.findIndex(o => o.uid === newMsg.uid) === -1) {
        for (let i = 0; i < station.messages.length; i++) {
          if (newMsg.wen < station.messages[i].wen) {
            storeMessages[newMsg.aud].messages.splice(i, 0, newMsg);
          } else if (i === (station.messages.length - 1)) {
            storeMessages[newMsg.aud].messages.push(newMsg);
            i = i + 1;
          }
        }

        // Pring messages by date, for debugging:
        // for (let msg of station.messages) {
        //   console.log(`msg ${msg.uid}: ${msg.wen}`);
        // }
      }
    });

    return storeMessages;
  }
}
