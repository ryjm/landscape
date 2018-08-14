import { REPORT_PAGE_STATUS, PAGE_STATUS_DISCONNECTED, PAGE_STATUS_READY } from '/lib/constants';

export class ViewsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case REPORT_PAGE_STATUS:
          // Don't let any state other than "READY" override the disconnected state
          let isDisconnected = store.views.transition === PAGE_STATUS_DISCONNECTED;
          let setToReady = rep.data === PAGE_STATUS_READY;

          if (!isDisconnected || setToReady) {
            store.views.transition = rep.data;
          }
          break;
      }
    });
  }
}
