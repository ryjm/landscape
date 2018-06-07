import _ from 'lodash';
import { MessagesReducer } from '/reducers/messages';
import { ConfigsReducer } from '/reducers/configs';
import { ViewsReducer } from '/reducers/views';
import { router } from '/router';

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
  'circles',
  'transition'
]

class UrbitWarehouse {
  constructor() {
    this.store = {
      messages: {
        inboxMessages: [],
        stations: {}
      },
      configs: {},
      views: {
        transition: ""
      }
    };

    this.reports = this.buildReports();

    this.messagesReducer = new MessagesReducer();
    this.configsReducer = new ConfigsReducer();
    this.viewsReducer = new ViewsReducer();

    this.pushCallback = this.pushCallback.bind(this);
    this.storeReports = this.storeReports.bind(this);
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

    this.storeReports(newReports);
  }

  storeReports(newReports) {
    newReports.forEach((rep) => console.log('new report: ', rep));

    this.messagesReducer.reduce(newReports, this.store.messages);
    this.configsReducer.reduce(newReports, this.store.configs);
    this.viewsReducer.reduce(newReports, this.store.views);

    console.log('full store = ', this.store);

    this.processPending(newReports);
    router.renderRoot();
  }

  processPending(reports) {
    reports.forEach((rep) => {
      let reportBucket = this.reports[rep.type];
      let clearIndexes = [];

      reportBucket.callbacks.forEach((callback, i) => {
        let callSuccess = callback(rep);
        // callbacks should return true, or _nothing_ to be considered complete)
        // default behavior is return nothing; complete on first keyed response
        if (callSuccess === true || typeof callSuccess === "undefined") {
          clearIndexes.push(i);
        }
      });

      _.pullAt(reportBucket.callbacks, clearIndexes);
    })
  }

  pushCallback(key, callback) {
    this.reports[key].callbacks.push(callback);
  }
}

export let warehouse = new UrbitWarehouse();
window.warehouse = warehouse;
