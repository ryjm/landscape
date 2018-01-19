import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: [],
      stations: {},
      stationMessages: {},
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

    console.log('data being stored = ', data);
    console.log('full store = ', this.store);

    this.updateFunc();
  }
}
