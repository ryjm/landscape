export class ViewsReducer {
  reduce(reports, store) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case "transition":
          store.views.transition = rep.data;
          break;
      }
    });
  }
}
