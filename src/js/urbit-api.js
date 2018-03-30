import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class UrbitApi {
  constructor() {
    console.log("API IS BEING INSTANTIATED");
  }

  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
  }

  // keep default bind to hall, since its bind procedure more complex for now AA
  bind(path, method, appl = "hall") {
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
    this.action("hall", "hall-action", data, transition);
  }

  coll(data, transition) {
    this.action("collections", "collections-action", data, transition);
  }

  action(appl, mark, data, transition) {
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
  }
}

export let api = new UrbitApi();
