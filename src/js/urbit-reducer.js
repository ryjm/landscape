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
}
