import { api } from './urbit-api';
import { uuid } from './util';

export let Reports = {
  'circle.gram': {
    execute: function (rep) {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "transition":
              window.router.transitionTo(item.data.target);
              break;
          }
        });
      }

      this.pending = [];
    }
  }, // messages
  'circle.nes': {}, // messages
  'circle.pes.loc': {},
  'circle.pes.rem': {},
  'circle.cos.loc': {}, // configs
  'circle.cos.rem': {}, // configs
  'circle.config.dif.full': {
    execute: function (rep) {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "transition":
              window.router.transitionTo(item.data.target);
              break;
            case "permit":
              api.permit(item.data.nom, item.data.aud, item.data.message);
              break;
            case "subscribe-dm":
              let dmHost = item.data.nom.split("/")[0].substr(1);
              api.hall({
                source: {
                  nom: item.data.nom,
                  sub: true,
                  srs: item.data.srs
                }
              });
              break;
          }
        });
      }

      this.pending = [];
    }
  },
  'circle.config.dif.source': {
    execute: function (rep) {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "transition":
              window.router.transitionTo(item.data.target);
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
    execute: function (rep) {
      if (this.pending) {
        this.pending.forEach((item) => {
          switch(item.type) {
            case "subscribe-inbox":
              let cir = (item.data && item.data.cir) ? item.data.cir : `~${api.authTokens.ship}/${rep.data.cir}`;

              api.hall({
                source: {
                  nom: `inbox`,
                  sub: true,
                  srs: [cir]
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

window.reports = Reports;
