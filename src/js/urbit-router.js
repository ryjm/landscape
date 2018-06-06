import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { UrbitWarehouse } from '/urbit-warehouse';
import { UrbitOperator } from '/urbit-operator';
import { getQueryParams } from '/util';
import { api } from '/urbit-api';
import { Root } from '/root';
import { TRANSITION_LOADING, TRANSITION_READY } from '/common/constants';

export class UrbitRouter {
  constructor() {
    this.pageRoot = "";
    this.domRoot = "#root";

    this.warehouse = new UrbitWarehouse(this.renderRoot.bind(this));
    this.operator = new UrbitOperator(this.warehouse);

    window.warehouse = this.warehouse;

    this.scaffold = document.querySelectorAll("#root")[0].innerHTML;
    this.renderRoot();

    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  renderRoot() {
    let rootComponent = (
      <Root
        store={this.warehouse.store}
        pushCallback={this.warehouse.pushCallback}
        queryParams={getQueryParams()}
        scaffold={this.scaffold} />
    )

    ReactDOM.render(rootComponent, document.querySelectorAll("#root")[0]);
  }

  linkType(path) {
    if (path.endsWith(".collections-edit")) {
      return "renderer";
    } else if (path.split("/")[2][0] == "~") {
      return "foreign";
    } else {
      return "local";
    }
  }

  filterUrl(url) {
    let path = url.split("?");
    let linkType = this.linkType(path[0]);

    switch (linkType) {
      case "foreign":
        path[0] += ".x-htm";
        break;
      case "local":
        path[0] += ".htm";
        break;
    }

    return path.join("?");
  }

  transitionTo(targetUrl, noHistory) {
    console.log("Transition to: ", this.filterUrl(targetUrl));

    this.warehouse.storeReports([{
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
      this.scaffold = resText;
      this.warehouse.storeReports([{
        type: "transition",
        data: TRANSITION_READY
      }]);
      this.renderRoot();
    });
  }

  registerAnchorListeners() {
    window.document.addEventListener('click', (e) => {
      // Walk the DOM node's parents to find 'a' tags up the chain
      let el = e.target;
      while (el && el.tagName != 'A') {
        el = el.parentNode;
      }
      // If you find an "a" tag in the clicked element's parents, it's a link
      if (el && el.hostname === "localhost") {
        e.preventDefault();
        this.transitionTo(el.pathname + el.search);
      }
    });
  }

  registerHistoryListeners() {
    window.onpopstate = (state) => {
      this.transitionTo(window.location.pathname + window.location.search, true);
    }
  }
}
