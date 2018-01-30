import React from 'react';
import ReactDOM from 'react-dom';

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

    fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
      return res.json();
    })
    .then((authTokens) => {
      warehouse.storeData({
        usership: authTokens.ship
      });
      this.authTokens = authTokens;
      this.runPoll();
      this.bindThings();
    });
  }

  bindThings() {
    // parses client-specific info (ship nicknames, glyphs, etc)
    this.sendBindRequest("/client", "PUT");

    // inbox local + remote configs
    this.sendBindRequest("/circle/inbox/config/0", "PUT");

    // inbox messages, remote presences
    this.sendBindRequest("/circle/inbox/grams/group-r/0", "PUT");

    // public membership
    this.sendBindRequest("/public", "PUT");

    // owner's circles
    this.sendBindRequest(`/circles/~${this.authTokens.ship}`, "PUT");

    // delete subscriptions when you're done with them, like...
    // this.sendBindRequest("/circle/inbox/grams/0", "DELETE");
  }

  sendBindRequest(path, method) {
    const params = {
      appl: "hall",
      mark: "json",
      oryx: this.authTokens.oryx,
      ship: this.authTokens.ship,
      path: path,
      wire: path
    };

    fetch(`/~/is/~${this.authTokens.user}/hall${path}.json?${method}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });
  }

  sendHallAction(data) {
    const params = {
      appl: "hall",
      mark: "hall-action",
      oryx: this.authTokens.oryx,
      ship: this.authTokens.ship,
      wire: "/",
      xyro: data
    };

    fetch(`/~/to/hall/hall-action`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });
  }

  pollServer() {
    console.log('fetching... ', this.seqn);
    return fetch(`/~/of/${this.authTokens.ixor}?poll=${this.seqn}`, {credentials: "same-origin"})
      .then((res) => {
        return res.json();
      });
  }

  runPoll() {
    this.pollServer().then((data) => {
      if (data.beat) {
        console.log('beat');
        this.runPoll();
      } else {
        console.log("new server data: ", data);

        const hallData = this.parseBS(data);
        this.warehouse.storeData(hallData);

        this.seqn++;
        this.runPoll();
      }
    });
  }

  // BS stands for "bulletin service"
  parseBS(bs) {
    return {
      configs: this.parseInboxConfigs(bs),
      messages: this.parseInboxMessages(bs)
    }
  }

  parseInboxMessages(bs) {
    let messages = [];

    let pathTokens = bs.from.path.split("/");

    if (pathTokens[1] === "circle"
     && pathTokens[2] === "inbox"
     && pathTokens[3] === "grams") {

      let {
        data: {
          json: {
            circle
          }
        }
      } = bs;

      if (circle.nes) {
        // Add inbox messages
        messages = circle.nes.map(m => m.gam);
      }

      if (circle.gram) {
        // Add single message
        messages = [circle.gram.gam];
      }
    }

    return messages;
  }

  parseInboxConfigs(bs) {
    let configs = {};

    let pathTokens = bs.from.path.split("/");

    if (pathTokens[1] === "circle"
     && pathTokens[2] === "inbox"
     && pathTokens[3] === "config") {

      let {
        data: {
          json: {
            circle
          }
        },
        from: {
          ship
        }
      } = bs;

      // Add inbox config
      let inbox = `~${ship}/inbox`;
      configs[inbox] = circle.cos.loc;

      // Add remote configs
      Object.keys(circle.cos.rem).forEach((remConfig) => {
        configs[remConfig] = circle.cos.rem[remConfig];
      });

      // TODO: Do .rem's nest infinitely? Can I keep going here if there's a chain of subscriptions?
    }

    return configs;
  }

}
