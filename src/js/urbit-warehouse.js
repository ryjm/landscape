import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: {},
      configs: {},
      usership: ""
    };

    this.reducer = new UrbitReducer();
    this.updateFunc = updateFunc;
  }

  storeData(data) {
    if (data.messages) {
      const messages = this.reducer.messages(data.messages, this.store.messages);
      this.store.messages = messages;
    }

    if (data.configs) {
      const configs = this.reducer.configs(data.configs, this.store.configs);
      this.store.configs = configs;
    }

    if (data.usership) {
      this.store.usership = data.usership;
    }

    console.log('full store = ', this.store);

    this.updateFunc();
  }
}
