import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: {},
      configs: {},
      ownedStations: [],
      usership: ""
    };

    this.reducer = new UrbitReducer();
    this.updateFunc = updateFunc;
  }

  storeData(data) {
    if (data.messages) {
      this.store.messages = this.reducer.messages(data.messages, this.store.messages);
    }

    if (data.configs) {
      this.store.configs = this.reducer.configs(data.configs, this.store.configs);
    }

    if (data.usership) {
      this.store.usership = data.usership;
    }

    if (data.ownedStations) {
      this.store.ownedStations = data.ownedStations;
    }

    console.log('full store = ', this.store);

    this.updateFunc();
  }
}
