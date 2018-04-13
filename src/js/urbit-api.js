import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { uuid } from './util';

class UrbitApi {
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
      let audInboxes = aud.map((aud) => `~${aud}/inbox`);
      let inviteMessage = {
        uid: uuid(),
        aud: audInboxes,
        aut: this.authTokens.ship,
        wen: Date.now(),
        sep: {
          inv: {
            inv: true,
            cir: `~${this.authTokens.ship}/${nom}`
          }
        }
      };

      this.hall({
        convey: [inviteMessage]
      });
    }
  }
}

export let api = new UrbitApi();
