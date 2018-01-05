import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor() {
    this.store = {
      messages: [],
      stations: {}
    };

    this.reducer = new UrbitReducer();
  }

  storeData(data) {
    if (data.messages) {
      const messages = this.reducer.messages(data.messages, this.store.messages);
      this.store.messages = messages;
    }

    if (data.stations) {
      const stations = this.reducer.stations(data.stations, this.store.stations);
      this.store.stations = stations;
    }

    console.log('data being stored = ', data);
    console.log('full store = ', this.store);
  }
}
