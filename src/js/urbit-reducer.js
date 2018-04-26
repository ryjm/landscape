import _ from 'lodash';

const INBOX_MESSAGE_COUNT = 30;

// TODO: This being a class is an error, since UrbitReducer doesn't hold state. Export these as individual functions or bundle them some other way.

/**
  storeMessages ==

  store: {
    messages: {
      inboxMessages: [{num: 1244, msg: "Hey friends"}, {num: 1244, msg: "Hiya ~ravmel"}]
      stations: {
        ~ravmel-rodpyl/friendclub: [{num: 1244, msg: "Hey friends"}, {num: 1244, msg: "Hiya ~ravmel"}]
        ~ravmel-rodpyl/members: [{num: 1244, msg: "Hey friends"}, {num: 1244, msg: "Hiya ~ravmel"}]
      }
    }
  }
**/

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
        case "circle.pes.loc":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          this.updateConfig({pes: rep.data}, storeConfigs[stationName]);
          break;
        case "circle.config.dif.source":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          this.updateConfig(rep.data, storeConfigs[stationName]);
          break;
        case "circle.config.dif.full":
          stationName = rep.data.src[0];  // TODO:  API weirdness; we have to get name of new station from new station config's src property. Should maybe return a dict.
          stations[stationName] = rep.data;
          this.storeConfigs(stations, storeConfigs);
          break;
        case "circle.config.dif.permit":  // TODO:  This is very wonky, should be fixed with API discussion
          stationName = rep.data.cir;
          this.updateConfig(rep.data.dif.permit, storeConfigs[stationName]);
          break;
        case "circle.config.dif.remove":
          delete storeConfigs[rep.data.cir];
          break;
      }
    });
  }

  storeConfigs(configs, storeConfigs) {
    Object.keys(configs).forEach((cos) => {
      storeConfigs[cos] = storeConfigs[cos] || {};
      Object.assign(storeConfigs[cos], configs[cos]);
    });
  }

  updateConfig(data, station) {
    if (data.src) {
      if (data.add) {
        station.src.push(data.src);
      } else {
        station.src = station.src.filter((val) => val !== data.src);
      }
    }

    if (data.sis) {
      if (data.add) {
        station.con.sis = station.con.sis.concat(data.sis);
      } else {
        station.con.sis = station.con.sis.filter((val) => !data.sis.includes(val));
      }
    }

    if (data.pes) {
      station.pes = station.pes || {};

      Object.assign(station.pes, data.pes);
    }
  }
}
