import { isDMStation } from '/lib/util';
import _ from 'lodash';

export class DmsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      let fromInbox = rep.from && rep.from.path.includes("inbox");

      switch (rep.type) {
        case "circle.cos.rem":
          if (fromInbox) {
            let dmStations = Object.keys(rep.data).filter(station => isDMStation(station));
            store.dms.stations = _.uniq([...store.dms.stations, ...dmStations]);
            store.dms.stored = true;
          }
          break;
        case "circle.config.dif.source":
          if (fromInbox && isDMStation(data.src)) {
            if (data.add) store.dms.stations = _.uniq([...store.dms.stations, data.src])
            if (!data.add) store.dms.stations = _.filter(store.dms.stations, s => s !== data.src);
          }
      }
    });
  }
}
