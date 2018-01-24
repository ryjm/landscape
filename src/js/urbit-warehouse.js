import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: [],
      stations: {},
      stationMessages: {},
      usership: "",
      header: {
        pageName: "",
        errata: null
      },
    };

    this.reducer = new UrbitReducer();
    this.updateFunc = updateFunc;
  }

  storeData(data) {
    if (data.messages) {
      const messages = this.reducer.messages(data.messages, this.store.messages);
      this.store.messages = messages;
    }

    if (data.messages) {
      const stationMessages = this.reducer.stationMessages(data.messages, this.store.stationMessages);
      this.store.stationMessages = stationMessages;
    }

    if (data.stations) {
      const stations = this.reducer.stations(data.stations, this.store.stations);
      this.store.stations = stations;
    }

    if (data.header) {
      this.store.header = _.merge({}, data.header, this.store.header);
    }

    if (data.usership) {
      this.store.usership = data.usership;
    }

    console.log('full store = ', this.store);

    this.updateFunc();
  }
}
