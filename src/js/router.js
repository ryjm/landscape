import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { warehouse } from '/warehouse';
import { UrbitOperator } from '/operator';
import { getQueryParams } from '/lib/util';
import { api } from '/api';
import { Root } from '/components/root';
import { TRANSITION_LOADING, TRANSITION_READY } from '/lib/constants';

class UrbitRouter {
  constructor() {
    this.transitionTo = this.transitionTo.bind(this);
    this.metaPressed = false;
  }

  start() {
    if (warehouse) {
      this.scaffold = document.querySelectorAll("#root")[0].innerHTML;
      this.renderRoot();

      this.registerAnchorListeners();
      this.registerHistoryListeners();
    } else {
      console.error("~~~ ERROR: Must initialize warehouse before operation ~~~");
    }
  }

  renderRoot() {
    let rootComponent = (
      <Root
        api={api}
        store={warehouse.store}
        storeReports={warehouse.storeReports}
        pushCallback={warehouse.pushCallback}
        transitionTo={this.transitionTo}
        queryParams={getQueryParams()}
        scaffold={this.scaffold} />
    )

    ReactDOM.render(rootComponent, document.querySelectorAll("#root")[0]);
  }

  linkType(path) {
    if (path.endsWith("?edit=true")) {
      // special casing this because it's cleaner than how it exists now
      return "edit-page";
    } else if (path.split("/")[2] != `~${api.authTokens.ship}`) {
      return "foreign";
    } else {
      return "local";
    }
  }

  filterUrl(url) {
    let path = url.split("?");
    let linkType = this.linkType(url);

    switch (linkType) {
      case "edit-page":
        if (linkType == "foreign") {
          path[0] += ".x-htm";
        } else {
          path[0] += ".htm";
        }
        break;
      case "foreign":
        path[0] += ".x-htm";
        break;
    }

    return path.join("?");
  }

  transitionTo(targetUrl, noHistory) {
    console.log("Transition to: ", this.filterUrl(targetUrl));

    warehouse.storeReports([{
      type: "transition",
      data: TRANSITION_LOADING
    }]);

    // TODO: Extremely brittle. Expecting parts of form: /~~/pages/nutalk + /show
    fetch(this.filterUrl(targetUrl), {credentials: "same-origin"}).then((res) => {
      return res.text();
    }).then((resText) => {
      if (!noHistory) {
        window.history.pushState({}, null, targetUrl);
      }

      this.scaffold = this.extractBody(resText) || resText;

      warehouse.storeReports([{
        type: "transition",
        data: TRANSITION_READY
      }]);

      this.renderRoot();
    });
  }

  extractBody(scaffold) {
    let parser = new DOMParser();
    let tempDOM = parser.parseFromString(scaffold, "text/html");
    let bodyQuery = tempDOM.querySelectorAll('#root')[0];
    return bodyQuery && bodyQuery.innerHTML;
  }

  registerAnchorListeners() {
    window.document.addEventListener('keydown', (e) => {
      // TODO:  Verify this works on Windows systems...
      if (e.metaKey) {
        this.metaPressed = true;
      }
    });

    window.document.addEventListener('keyup', (e) => {
      this.metaPressed = false;
    });

    window.document.addEventListener('click', (e) => {
      // Walk the DOM node's parents to find 'a' tags up the chain
      let el = e.target;
      while (el && el.tagName != 'A') {
        el = el.parentNode;
      }
      // If you find an "a" tag in the clicked element's parents, it's a link
      if (el && el.hostname === "localhost") {
        if (!this.metaPressed) {
          e.preventDefault();
          this.transitionTo(el.pathname + el.search);
        }
      }
    });
  }

  registerHistoryListeners() {
    window.onpopstate = (state) => {
      this.transitionTo(window.location.pathname + window.location.search, true);
    }
  }
}

export let router = new UrbitRouter();
window.router = router;
