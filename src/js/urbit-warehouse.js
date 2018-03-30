import _ from 'lodash';
import { UrbitReducer } from './urbit-reducer';
import { MessagesReducer, ConfigsReducer } from './urbit-reducer';
import { api } from './urbit-api';
import { Reports } from './urbit-reports';

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

    this.messagesReducer = new MessagesReducer();
    this.configsReducer = new ConfigsReducer();
  }

  storeReports(reports) {
    this.messagesReducer.reduce(reports, this.store.messages);
    this.configsReducer.reduce(reports, this.store.configs);

    console.log('full store = ', this.store);

    this.processPending(reports);
    this.updateFunc();
  }

  processPending(reports) {
    reports.forEach((rep) => {
      let type = Reports[rep.type];
      if (type && type.execute) {
        type.execute();
      }
    })
  }

  pushPending(key, data) {
    Reports[key].pending = (Reports[key].pending || []).concat(data);
  }











  // setPendingTransition(transition) {
  //   this.pendingTransition = transition;
  // }
  //
  // storeData(data) {
  //   if (data.messages) {
  //     this.store.messages = this.reducer.messages(data.messages, this.store.messages);
  //   }
  //
  //   if (data.configs) {
  //     this.store.configs = this.reducer.configs(data.configs, this.store.configs);
  //   }
  //
  //   if (data.usership) {
  //     this.store.usership = data.usership;
  //   }
  //
  //   if (data.ownedStations) {
  //     this.store.ownedStations = data.ownedStations;
  //   }
  //
  //   if (data.pendingInvites) {
  //     this.store.pendingInvites = this.store.pendingInvites.concat(data.pendingInvites);
  //   }
  //
  //   console.log('new store obj =', data);
  //   console.log('full store = ', this.store);
  //
  //   this.updateFunc();
  // }
}
