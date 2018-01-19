// TODO: This being a class is an error, since UrbitReducer doesn't hold state. Export these as individual functions or bundle them some other way.
export class UrbitReducer {
  messages(newMessages, storeMessages) {
    newMessages.forEach((newMsg) => {
      if (storeMessages.findIndex(o => o.uid === newMsg.uid) === -1) {
        storeMessages.push(newMsg);
      }
    });

    return storeMessages;
  }

  stations(newStations, storeStations) {
    const stations = Object.keys(storeStations);

    newStations.forEach((newStation) => {
      if (stations.indexOf(newStation) === -1) {
        storeStations[newStation] = {
          name: newStation
        }
      }
    })

    return storeStations;
  }

  /*
    Same as messages, but stored as a bucket of sorted messages inside individual stations for easy access later.

    Messages within stations are stored "oldest-first".
  */
  stationMessages(newMessages, storeStationMessages) {
    newMessages.forEach((newMsg) => {
      console.log ("hi!, ", newMsg.station);

      let station = storeStationMessages[newMsg.station];

      if (!station) {
        storeStationMessages[newMsg.station] = {
          name: newMsg.station,
          messages: [newMsg]
        };
      } else if (station.messages.findIndex(o => o.uid === newMsg.uid) === -1) {
        for (let i = 0; i < station.messages.length; i++) {
          if (newMsg.timestamp < station.messages[i].timestamp) {
            station.messages.splice(i, 0, newMsg);
          }
        }

        // For debugging:
        // for (let msg of station.messages) {
        //   console.log(`msg ${msg.uid}: ${msg.timestamp}`);
        // }
      }
    });

    return storeStationMessages;
  }
}
