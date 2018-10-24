import _ from 'lodash';
import { MessagesReducer } from '/reducers/messages';
import { ConfigsReducer } from '/reducers/configs';
import { ViewsReducer } from '/reducers/views';
import { NamesReducer } from '/reducers/names';
import { PublicReducer } from '/reducers/public';
// import { CirclesReducer } from '/reducers/circles';
import { router } from '/router';
import { PAGE_STATUS_READY, PAGE_STATUS_PROCESSING, REPORT_PAGE_STATUS, REPORT_NAVIGATE } from '/lib/constants';

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
  REPORT_PAGE_STATUS,
  REPORT_NAVIGATE,
  'public',
  'menu.toggle',
  'config.ext',
  'inbox.sources-loaded'
]

class UrbitWarehouse {
  constructor() {
    this.store = {
      messages: {
        inbox: {
          src: [],
          messages: [],
          config: {}
        },
        stations: {}
      },
      configs: {},
      views: {
        transition: PAGE_STATUS_PROCESSING,
        inbox: "inbox-recent"
      },
      names: {},
      public: {},
      circles: [],
      dms: {
        stored: false,
        stations: []
      },
    };

    this.reports = this.buildReports();

    this.messagesReducer = new MessagesReducer();
    this.configsReducer = new ConfigsReducer();
    this.viewsReducer = new ViewsReducer();
    this.namesReducer = new NamesReducer();
    this.publicReducer = new PublicReducer();
    // this.circlesReducer = new CirclesReducer();

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
    this.messagesReducer.reduce(newReports, this.store);
    this.configsReducer.reduce(newReports, this.store);
    this.viewsReducer.reduce(newReports, this.store);
    this.namesReducer.reduce(newReports, this.store);
    // this.circlesReducer.reduce(newReports, this.store);
    this.publicReducer.reduce(newReports, this.store);

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
    if (typeof key === "string") {
      this.reports[key].callbacks.push(callback);
    } else if (_.isArray(key)) {
      key.forEach(k => {
        this.reports[k].callbacks.push(callback);
      })
    }
  }
}

export let warehouse = new UrbitWarehouse();
window.warehouse = warehouse;
