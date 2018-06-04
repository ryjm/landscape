import _ from 'lodash';
import { MessagesReducer, ConfigsReducer } from './urbit-reducer';
import { api } from './urbit-api';

const REPORT_KEYS = [
  'circle.gram',
  'circle.nes',
  'circle.pes.loc',
  'circle.pes.rem',
  'circle.cos.loc',
  'circle.cos.rem',
  'circle.config.dif.full',
  'circle.config.dif.source',
  'circle.config.dif.permit/circle.config',
  'circle.config.dif.remove/circle.config',
  'circles'
]

export class UrbitWarehouse {
  constructor(updateFunc) {
    this.store = {
      messages: {
        inboxMessages: [],
        stations: {}
      },
      configs: {}
    };

    this.reports = this.buildReports();
    this.updateFunc = updateFunc;

    this.messagesReducer = new MessagesReducer();
    this.configsReducer = new ConfigsReducer();

    this.pushCallback = this.pushCallback.bind(this);
  }

  buildReports() {
    let reports = {};

    REPORT_KEYS.forEach((type) => {
      // TOOD: dataKeys are here because report fragments don't contain all the
      // data we need to process; sometimes we need to grab the whole chain
      let [reportKey, dataKey] = type.split("/");

      reports[reportKey] = {
        callbacks: [],
        dataKey: (dataKey) ? dataKey : reportKey
      }
    })

    return reports;
  }

  storePollResponse(pollResponse) {
    let newReports = [];
    let reportTypes = Object.keys(this.reports);
    let json = pollResponse.data.json;

    reportTypes.forEach((type) => {
      let reportData = _.get(json, type, null);

      let hasContent = (
        (_.isArray(reportData) && _.isEmpty(reportData)) ||
        (_.isObject(reportData) && _.isEmpty(reportData)) ||
        (reportData !== null)
      );

      if (hasContent) {
        // TODO: Actually grab the data again, "up the chain", for when
        // fragments don't contain all the data we need
        reportData = _.get(json, this.reports[type].dataKey, null);

        newReports.push({
          type: type,
          data: reportData,
          from: pollResponse.from
        });
      }
    });

    newReports.forEach((rep) => console.log('new report: ', rep));

    this.storeReports(newReports);
  }

  storeReports(newReports) {
    this.messagesReducer.reduce(newReports, this.store.messages);
    this.configsReducer.reduce(newReports, this.store.configs);

    console.log('full store = ', this.store);

    this.processPending(newReports);
    this.updateFunc();
  }

  processPending(reports) {
    reports.forEach((rep) => {
      let reportBucket = this.reports[rep.type];

      reportBucket.callbacks.forEach((callback) => {
        callback(rep);
      });

      reportBucket.callbacks = [];
    })
  }

  pushCallback(key, callback) {
    this.reports[key].callbacks.push(callback);
  }
}
