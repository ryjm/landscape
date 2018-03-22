// TODO: This being a class is an error, since UrbitReducer doesn't hold state. Export these as individual functions or bundle them some other way.
export class UrbitReducer {
  configs(newConfigs, storeConfigs) {
    Object.keys(newConfigs).forEach((cos) => {
      if (!storeConfigs[cos]) {
        storeConfigs[cos] = newConfigs[cos];
        return;
      }

      // Add or remove a src to an existing circle (most useful for the inbox)
      if (newConfigs[cos].src) {
        // update existing config
        if (newConfigs[cos].add) {
          storeConfigs[cos].src = [...storeConfigs[cos].src, newConfigs[cos].src];
        } else {
          let n = newConfigs[cos].src;
          storeConfigs[cos].src = storeConfigs[cos].src.filter((val) => val != n);
        }
      }

      // Add or remove new ships to b/w list
      if (newConfigs[cos].permit) {
        storeConfigs[cos].con.sis = (newConfigs[cos].permit.add) ?
          storeConfigs[cos].con.sis.concat(newConfigs[cos].permit.sis) :
          storeConfigs[cos].con.sis.filter(mem => !newConfigs[cos].permit.sis.includes(mem));
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
      console.log('newMsg.aud = ', newMsg.aud);

      newMsg.aud.forEach(aud => {
        let station = storeMessages[aud];

        if (!station) {
          storeMessages[aud] = {
            name: aud,
            messages: [newMsg]
          };
        } else if (station.messages.findIndex(o => o.uid === newMsg.uid) === -1) {
          let newest = true;

          for (let i = 0; i < station.messages.length; i++) {
            if (newMsg.wen < station.messages[i].wen) {
              storeMessages[aud].messages.splice(i, 0, newMsg);
              newest = false;
              break;
            }
          }

          if (newest) storeMessages[aud].messages.push(newMsg);

          // Print messages by date, for debugging:
          // for (let msg of station.messages) {
          //   console.log(`msg ${msg.uid}: ${msg.wen}`);
          // }
        }
      })


    });

    return storeMessages;
  }
}
