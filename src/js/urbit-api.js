import React from 'react';
import ReactDOM from 'react-dom';
import { MessagesPage } from './components/messages.js';

export class UrbitApi {
  constructor() {
    this.seqn = 1;

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
    this.sendBindRequest("/circle/inbox/grams/0/3", "PUT");
    // delete inbox message subscription? wut?
    this.sendBindRequest("/circle/inbox/grams/0/3", "DELETE");
  }

  sendBindRequest(path, method) {
    var params = {
      appl: "hall",
      mark: "json",
      oryx: this.authTokens.oryx,
      path: path,
      ship: this.authTokens.ship,
      wire: path
    };

    fetch(`/~/is/~${this.authTokens.user}/hall${path}.json?${method}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });
  }

  *pollServer() {
    while (true) {
      yield fetch(`/~/of/${this.authTokens.ixor}?poll=${this.seqn}`, {credentials: "same-origin"})
        .then((res) => {
          return res.json();
        });
    }
  }

  runPoll(generator) {
    if (!generator) {
      generator = this.pollServer();
    }

    var p = generator.next();
    p.value.then((data) => {
      if (data.beat) {
        console.log('beat');
        this.runPoll(generator);
      } else {
        console.log("the data! ", data);
        this.parseBS(data);
        this.seqn++;
        this.runPoll(generator);
      }
    })
  }

  // BS stands for "bulletin service"
  parseBS(bs) {
    if (bs.data && bs.data.json && bs.data.json.circle && bs.data.json.circle.nes) {
      var messages = bs.data.json.circle.nes;

      console.log("bs = ", messages);

      var cleanMessages = messages.map((msg) => {
        return {
          author: msg.gam.aut,
          body: msg.gam.sep.lin.msg
        };
      });

      ReactDOM.render(<MessagesPage messages={cleanMessages}/>, document.querySelectorAll('[data-componen="MessagesPage"]')[0]);
    }
  }
}
