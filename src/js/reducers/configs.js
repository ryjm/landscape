import { isRootCollection } from '/lib/util';

export class ConfigsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      let stationName;
      let stations = {};

      switch (rep.type) {
        case "circle.cos.loc":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          stations[stationName] = rep.data;
          this.addConfigs(stations, store.configs);
          break;
        case "circle.cos.rem":
          this.addConfigs(rep.data, store.configs);
          break;
        case "circle.pes.loc":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          this.updateConfig({pes: rep.data}, store.configs[stationName]);
          break;
        case "circle.config.dif.source":
          stationName = `~${rep.from.ship}/${rep.from.path.split("/")[2]}`;
          this.updateConfig(rep.data, store.configs[stationName]);
          break;
        case "circle.config.dif.full":
          stationName = rep.data.src[0];  // TODO:  API weirdness; we have to get name of new station from new station config's src property. Should maybe return a dict.
          stations[stationName] = rep.data;
          this.addConfigs(stations, store.configs);
          break;
        case "circle.config.dif.permit":  // TODO:  This is very wonky, should be fixed with API discussion
          stationName = rep.data.cir;
          this.updateConfig(rep.data.dif.permit, store.configs[stationName]);
          break;
        case "circle.config.dif.remove":
          delete store.configs[rep.data.cir];
          break;
      }
    });
  }

  addConfigs(configs, storeConfigs) {
    Object.keys(configs).forEach((cos) => {
      if (isRootCollection(cos)) return;
      
      storeConfigs[cos] = storeConfigs[cos] || {};
      Object.assign(storeConfigs[cos], configs[cos]);
      if (cos.includes('inbox')) {
        storeConfigs["inbox"] = configs[cos];
      }
    });
  }

  updateConfig(data, station) {
    if (!station) return;

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
