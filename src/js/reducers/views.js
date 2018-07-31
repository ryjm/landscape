import { REPORT_PAGE_STATUS } from '/lib/constants';

export class ViewsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case REPORT_PAGE_STATUS:
          store.views.transition = rep.data;
          break;
      }
    });
  }
}
