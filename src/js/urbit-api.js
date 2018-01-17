import React from 'react';
import ReactDOM from 'react-dom';
import { MessagesPage } from './components/messages.js';

export class UrbitApi {
  constructor(warehouse) {
    this.seqn = 1;
    this.warehouse = warehouse;

    fetch('/~/auth.json',{credentials: "same-origin"}).then((res) => {
      return res.json();
    })
    .then((authTokens) => {
      this.authTokens = authTokens;
      this.runPoll();
      this.bindThings();
    });
  }

  bindThings() {
    // no idea
    this.sendBindRequest("/client", "PUT");
    // inbox config?
    this.sendBindRequest("/circle/inbox/config-l/group-r/0", "PUT");
    // inbox messages?
    this.sendBindRequest("/circle/inbox/grams/0", "PUT");
    // this.sendBindRequest("/public", "PUT");
    // this.sendBindRequest(`/circles/~${this.authTokens.ship}`, "PUT");
    // delete inbox message subscription? wut?
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
        console.log("the data! ", data);

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
      stations: this.parseBSStations(bs),
      messages: this.parseBSMessages(bs)
    }
  }

  parseBSMessages(bs) {
    if (bs.data && bs.data.json && bs.data.json.circle && bs.data.json.circle.nes) {
      const messages = bs.data.json.circle.nes;
      return messages.map((msg) => {
        return {
          author: msg.gam.aut,
          body: msg.gam.sep.lin.msg,
          station: msg.gam.aud[0],
          uid: msg.gam.uid,
          timestamp: msg.gam.wen,
        };
      });
    }
  }

  parseBSStations(bs) {
    if (bs.data &&
        bs.data.json &&
        bs.data.json.circle &&
        bs.data.json.circle.cos &&
        bs.data.json.circle.cos.loc &&
        bs.data.json.circle.cos.loc.src ) {

      const stations = bs.data.json.circle.cos.loc.src;
      return stations;
    }
  }
}
