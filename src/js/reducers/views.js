export class ViewsReducer {
  reduce(reports, storeViews) {
    reports.forEach((rep) => {
      switch (rep.type) {
        case "transition":
          storeViews.transition = rep.data;
          break;
      }
    });
  }
}
