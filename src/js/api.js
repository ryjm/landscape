import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { uuid } from '/lib/util';

class UrbitApi {
  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
    this.bindPaths = [];
  }

  // keep default bind to hall, since its bind procedure more complex for now AA
  bind(path, method, ship = this.authTokens.ship, appl = "hall") {
    console.log('binding to ...', appl, ", path: ", path, ", as ship: ", ship, ", by method: ", method);
    this.bindPaths = _.uniq([...this.bindPaths, path]);

    const params = {
      appl,
      mark: "json",
      oryx: this.authTokens.oryx,
      ship: ship,
      path: path,
      wire: path
    };

    return fetch(`/~/is/~${ship}/${appl}${path}.json?${method}`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(params)
    });
  }

  hall(data) {
    this.action("hall", "hall-action", data);
  }

  coll(data) {
    this.action("collections", "collections-action", data);
  }

  setOnboardingBit(value) {
    this.action("collections", "json", { onboard: value });
  }

  action(appl, mark, data) {
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

  /*
    Special actions
  */

  permit(nom, aud, message) {
    this.hall({
      permit: {
        nom: nom,
        sis: aud,
        inv: true
      }
    });

    if (message) {
      let audInboxes = aud.map((aud) => `~${aud}/i`);
      let inviteMessage = {
        aud: audInboxes,
        ses: [{
          inv: {
            inv: true,
            cir: `~${this.authTokens.ship}/${nom}`
          }
        }]
      };

      this.hall({
        phrase: inviteMessage
      });
    }
  }
}

export let api = new UrbitApi();
window.api = api;
