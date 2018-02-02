import React from 'react';
import ReactDOM from 'react-dom';
//import { MessagesPage } from './components/messages.js';

/**
  Response format

  {
    data: {
      json: {
        circle: {   // *.loc for local, *.rem for remote
          cos:      // config
          pes:      // presence
          nes:      // messages
          gram:     // message (individual)
        }
        circles:    // circles you own
        public:     // circles in your public membership list
        client: {
          gys:      // glyphs
          nis:      // nicknames
        }
        peers:      // subscribers to your circles
        status:     // rumor, presence -- TODO?
      }
    }
    from: {
      path:    // Subscription path that triggered response
      ship:    // Subscription requestor
    }
  }
**/

export class UrbitApi {
  constructor(warehouse) {
    this.seqn = 1;
    this.warehouse = warehouse;
    this.transition = null;

    fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
      return res.json();
    })
    .then((authTokens) => {
      warehouse.storeData({
        usership: authTokens.ship
      });
      this.authTokens = authTokens;
      console.log("usership = ", this.authTokens.ship);
      this.runPoll();
      this.bindAll();
    });
  }

  bindAll() {
    // parses client-specific info (ship nicknames, glyphs, etc)
    this.bindHall("/client", "PUT");

    // inbox local + remote configs
    this.bindHall("/circle/inbox/config/0", "PUT");

    // inbox messages, remote presences
    this.bindHall("/circle/inbox/grams/group-r/0/500", "PUT");

    // public membership
    this.bindHall("/public", "PUT");

    // owner's circles
    this.bindHall(`/circles/~${this.authTokens.ship}`, "PUT");

    // bind to collections
    this.sendBindRequest("/", "PUT", "collections");

    // delete subscriptions when you're done with them, like...
    // this.bindHall("/circle/inbox/grams/0", "DELETE");

    this.hall({
      permit: {
        nom: "eloel",
        sis: ["polzod"],
        inv: true
      }
    });
  }

  // keep default bind to hall, since its bind procedure more complex for now AA
  bindHall(path, method, appl = "hall") {
    console.log('binding to ...', appl);
    const params = {
      appl,
      mark: "json",
      oryx: this.authTokens.oryx,
      ship: this.authTokens.ship,
      path: path,
      wire: path
    };

    fetch(`/~/is/~${this.authTokens.user}/${appl}${path}.json?${method}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });
  }

  hall(data, transition) {
    this.sendAction("hall", "hall-action", data, transition);
  }

  sendCollAction(data, transition) {
    this.sendAction("collections", "collections-action", data, transition);
  }

  sendAction(appl, mark, data, transition) {
    const params = {
      appl,
      mark,
      oryx: this.authTokens.oryx,
      ship: this.authTokens.ship,
      wire: "/",
      xyro: data
    };

    fetch(`/~/to/${appl}/${mark}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });

    if (transition) {
      this.warehouse.setPendingTransition(transition);
    }
  }

  runPoll() {
    console.log('fetching... ', this.seqn);
    fetch(`/~/of/${this.authTokens.ixor}?poll=${this.seqn}`, {credentials: "same-origin"})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.beat) {
          console.log('beat');
          this.runPoll();
        } else {
          console.log("new server data: ", data);

          const hallData = this.parseBS(data);
          this.warehouse.storeData(hallData);

          // TODO:  Side effects get processed here, after warehouse data is updated. Would prefer to do this inside warehouse itself, but warehouse doesn't have access to the API. Need to think through this much more carefully, as this is the crux of asychronous state updates in the system.
          // this.processSideEffects();

          this.seqn++;
          this.runPoll();
        }
    });
  }

  // BS stands for "bulletin service"
  parseBS(bs) {
    return {
      configs: this.parseInboxConfigs(bs),
      messages: this.parseInboxMessages(bs),
      ownedStations: this.parseOwnedStations(bs)
    }
  }

  parseInboxMessages(bs) {
    let messages = [];

    let pathTokens = bs.from.path.split("/");

    if (pathTokens[1] === "circle"
     && pathTokens[2] === "inbox"
     && pathTokens[3] === "grams") {

      let circle = bs.data.json.circle;
      if (circle.nes) {
        // Add inbox messages
        messages = circle.nes.map(m => m.gam);
      }

      if (circle.gram) {
        // Add single message
        messages = [circle.gram.gam];
      }
    }

    return messages.map(m => {

      // Remove ~ship/inbox from audiences if they exist
      // TODO:  This is legacy from old web talk. In general we should perhaps
      // drop chat messages addressed directly to inbox (?)
      let i = m.aud.indexOf(`~${this.authTokens.ship}/inbox`);
      if (i !== -1 && m.aud.length > 1) {
        m.aud.splice(i, 1);
      }

      // flatten msg.sep.app into msg
      // TODO:  Bake this into Hall api response if possible
      if (m.sep.app) {
        m.sep = m.sep.app.sep;
        m.app = true;
        m.aut = "rob";
      }

      return m;
    });
  }

  parseInboxConfigs(bs) {
    let configs = {};

    let pathTokens = bs.from.path.split("/");

    if (pathTokens[1] === "circle"
     && pathTokens[2] === "inbox"
     && pathTokens[3] === "config") {

      let circle = bs.data.json.circle;

      if (circle.config && circle.config.dif && circle.config.dif.full) {
        console.log('circle circle.config.dif.full', circle.config.cir);
        configs[circle.config.cir] = circle.config.dif.full;
      }

      // if (circle.config && circle.config.dif && circle.config.dif.permit && circle.config.dif.permit.add) {
      //   console.log('circle circle.config.dif.full', circle.config.cir);
      //
      //   configs[circle.config.cir] = configs[circle.config.cir] || {};
      //   configs[circle.config.cir].sis = circle.config.dif.permit.sis;
      // }

      if (circle.cos && circle.cos.loc) {
        // Add inbox config
        console.log('circle config.cos.loc', circle.cos.loc);
        let inbox = `~${this.authTokens.ship}/inbox`;
        configs[inbox] = circle.cos.loc;
      }

      if (circle.cos && circle.cos.rem) {
        // Add remote configs
        // TODO: Do .rem's nest infinitely? Can I keep going here if there's a chain of subscriptions?
        console.log('circle config.cos.rem', circle.cos.rem);
        Object.keys(circle.cos.rem).forEach((remConfig) => {
          configs[remConfig] = circle.cos.rem[remConfig];
        });
      }

      Object.keys(configs).forEach(cos => {
        this.warehouse.store.pendingInvites.forEach(inv => {
          if (cos.indexOf(inv.nom) !== -1) {
            this.hall({
              permit: {
                nom: inv.nom,
                sis: inv.aud,
                inv: true
              }
            });
          }
        });
      })
    }

    return configs;
  }

  parseOwnedStations(bs) {
    let pathTokens = bs.from.path.split("/");

    if (pathTokens[1] === "circles"
     && pathTokens[2] === `~${this.authTokens.ship}`) {

      let ownedStations = bs.data.json.circles;

      if (ownedStations.cir && ownedStations.add) {
        this.hall({
          source: {
            nom: `inbox`,
            sub: true,
            srs: [`~${this.authTokens.ship}/${ownedStations.cir}`]
          }
        });
      }
    }

    return [];
  }

  processSideEffects() {
    // this.subscribeToOwnedStations();
  }

  subscribeToOwnedStations() {
    let {ownedStations, configs} = this.warehouse.store;
    let pendingStations = [];

    console.log('ownedStations = ', ownedStations);

    ownedStations.forEach(station => {
      if (!configs[station]) {
        pendingStations.push(`${this.authTokens.ship}/${station}`);
      }
    });

    if (pendingStations.length > 0) {
      this.hall({
        source: {
          nom: `~${this.authTokens.ship}/inbox`,
          sub: true,
          srs: [pendingStations]
        }
      });
    }
  }
}
