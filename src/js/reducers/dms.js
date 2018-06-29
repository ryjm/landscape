import { isDMStation } from '/lib/util';
import _ from 'lodash';

export class DmsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      if (rep.type == "circles" && _.isArray(rep.data)) {
        let newStations = rep.data.filter(station => isDMStation(`${rep.from.ship}/${station}`));
        store.dms.stations = _.uniq([...store.dms.stations, ...newStations]);
        store.dms.stored = true;
      } else if (rep.type == "circles" && rep.data.cir) {
        if (rep.data.add) {
          store.dms.stations = _.uniq([...store.dms.stations, rep.data.cir]);
        } else {
          store.dms.stations = _.filter(store.dms.stations, s => s !== rep.data.cir);
        }
      }
    });
  }
}
