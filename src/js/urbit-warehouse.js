import _ from 'lodash';
import { MessagesReducer, ConfigsReducer } from './urbit-reducer';
import { api } from './urbit-api';
import { Reports } from './urbit-reports';

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: {},
      configs: {}
    };

    this.updateFunc = updateFunc;

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
}
