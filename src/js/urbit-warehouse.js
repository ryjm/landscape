import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: {},
      configs: {},
      ownedStations: [],
      pendingInvites: [],
      usership: ""
    };

    this.reducer = new UrbitReducer();
    this.updateFunc = updateFunc;
    this.pendingTransition = null;
  }

  setPendingTransition(transition) {
    this.pendingTransition = transition;
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

    if (data.pendingInvites) {
      this.store.pendingInvites = this.store.pendingInvites.concat(data.pendingInvites);
    }

    console.log('new store obj =', data);
    console.log('full store = ', this.store);

    this.updateFunc();
  }
}
