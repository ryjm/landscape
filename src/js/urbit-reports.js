import { api } from './urbit-api';
import { uuid } from './util';

export let Reports = {
  'circle.gram': {}, // messages
  'circle.nes': {}, // messages
  'circle.pes.loc': {},
  'circle.pes.rem': {},
  'circle.cos.loc': {}, // configs
  'circle.cos.rem': {}, // configs
  'circle.config.dif.full': {
    execute: function () {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "transition":
              window.router.transitionTo(item.data.target);
              break;
            case "permit":
              api.permit(item.data.nom, item.data.aud, item.data.message);
              break;
            case "fill-dms":
              api.bind(`/circle/inbox/${item.data.nom}/grams`, 'PUT');
              break;
          }
        });
      }

      this.pending = [];
    }
  },
  'circle.config.dif.source': {
    execute: function () {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "transition":
              window.router.transitionTo(item.data.target)
              break;
          }
        })
      }

      this.pending = [];
    }
  },
  'circle.config.dif.permit': {
    include: "circle.config"
  },
  'circle.config.dif.remove': {
    include: "circle.config"
  },
  'circles': {
    execute: function () {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "subscribe-inbox":
              api.hall({
                source: {
                  nom: `inbox`,
                  sub: true,
                  srs: [item.data.cir]
                }
              });
              break;
          }
        })

        this.pending = [];
      }
    }
  }
}
