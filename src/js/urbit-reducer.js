// TODO: This being a class is an error, since UrbitReducer doesn't hold state. Export these as individual functions or bundle them some other way.

export class MessagesReducer {
  reduce(reports, storeMessages) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case "circle.nes":
          this.storeMessages(rep.data, storeMessages);
          break;
        case "circle.gram":
          this.storeMessages([rep.data], storeMessages);
      }
    });
  }

  storeMessages(messages, storeMessages) {
    messages.forEach((message) => {
      let msg = message.gam;
      msg.aud.forEach((aud) => {
        let station = storeMessages[aud];

        if (!station) {
          storeMessages[aud] = {
            name: aud,
            messages: [msg]
          }
        } else if (station.messages.findIndex(o => o.uid === msg.uid) === -1) {
          let newest = true;

          for (let i = 0; i < station.messages.length; i++) {
            if (msg.wen < station.messages[i].wen) {
              storeMessages[aud].messages.splice(i, 0, msg);
              newest = false;
              break;
            }
          }

          if (newest) storeMessages[aud].messages.push(msg);

          // Print messages by date, for debugging:
          // for (let msg of station.messages) {
          //   console.log(`msg ${msg.uid}: ${msg.wen}`);
          // }
        }
      })
    });
  }
}

export class ConfigsReducer {
  reduce(reports, storeConfigs) {
    reports.forEach((rep) => {
      let stationName;
      let stations = {};

      switch (rep.type) {
        case "circle.cos.loc":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          stations[stationName] = rep.data;
          this.storeConfigs(stations, storeConfigs);
          break;
        case "circle.cos.rem":
          this.storeConfigs(rep.data, storeConfigs);
          break;
        case "circle.config.dif.source":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          this.updateConfig(stationName, rep.data, storeConfigs);
          break;
        case "circle.config.dif.full":
          stationName = rep.data.src[0];  // TODO:  API weirdness; we have to get name of new station from new station config's src property. Should maybe return a dict.
          stations[stationName] = rep.data;
          this.storeConfigs(stations, storeConfigs);
          break;
      }
    });
  }

  storeConfigs(configs, storeConfigs) {
    Object.keys(configs).forEach((cos) => {
      storeConfigs[cos] = configs[cos];
    })
  }

  updateConfig(stationName, data, storeConfigs) {
    if (data.src) {
      if (data.add) {
        storeConfigs[stationName].src.push(data.src);
      } else {
        storeConfigs[stationName].src = storeConfigs[stationName].src.filter((val) => val !== data.src);
      }
    }
  }
}

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
  // messages(newMessages, storeMessages) {
  //   newMessages.forEach((newMsg) => {
  //     console.log('newMsg.aud = ', newMsg.aud);
  //
  //     newMsg.aud.forEach(aud => {
  //       let station = storeMessages[aud];
  //
  //       if (!station) {
  //         storeMessages[aud] = {
  //           name: aud,
  //           messages: [newMsg]
  //         };
  //       } else if (station.messages.findIndex(o => o.uid === newMsg.uid) === -1) {
  //         let newest = true;
  //
  //         for (let i = 0; i < station.messages.length; i++) {
  //           if (newMsg.wen < station.messages[i].wen) {
  //             storeMessages[aud].messages.splice(i, 0, newMsg);
  //             newest = false;
  //             break;
  //           }
  //         }
  //
  //         if (newest) storeMessages[aud].messages.push(newMsg);
  //
  //         // Print messages by date, for debugging:
  //         // for (let msg of station.messages) {
  //         //   console.log(`msg ${msg.uid}: ${msg.wen}`);
  //         // }
  //       }
  //     })
  //
  //
  //   });
  //
  //   return storeMessages;
  // }
}
