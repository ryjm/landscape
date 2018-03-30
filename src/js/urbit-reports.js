export let Reports = {
  'circle.gram': {},
  'circle.nes': {},
  'circle.pes.loc': {},
  'circle.pes.rem': {},
  'circle.cos.loc': {},
  'circle.cos.rem': {},
  'circle.config.dif.full': {
    execute: function () {
      this.pending.forEach((item) => {
        switch(item.type) {
          case "console.log":
            console.log(item.message);
            break;
        }
      })

      this.pending = [];
    }
  },
  'circle.config.dif.source': {},
  'circle.config.dif.permit': {},
  'circles': {}
}
