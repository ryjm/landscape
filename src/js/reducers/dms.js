import { isDMStation } from '/lib/util';

export class DmsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case "circles":
          store.dmStations = rep.data.filter(station => isDMStation(`${rep.from.ship}/${station}`));
          break;
      }
    });
  }
}
