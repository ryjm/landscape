import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';
import { UrbitApi } from './urbit-api';
import { UrbitWarehouse } from './urbit-warehouse';

export class UrbitRouter {
  constructor() {
    // TODO: Fix this later to not suck.
    // this.pageRoot = "/~~/pages/nutalk/";

    console.log('router loaded');
    this.pageRoot = "";

    this.domRoot = "#root";

    this.warehouse = new UrbitWarehouse();
    this.api = new UrbitApi(this.warehouse);

    this.instantiateReactComponents();
    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  instantiateReactComponents() {
    var componentElements = document.querySelectorAll('[data-component]');

    console.log('componentElements.len = ', componentElements.length);

    componentElements.forEach((elem) => {
      // grab the name of the component
      var componentName = elem.dataset.component;
      // look up the component type in component-map, instantiate it
      var component = React.createElement(ComponentMap[componentName], {
        api: this.api,
        store: this.warehouse.store
      });
      ReactDOM.render(component, elem);
    });
  }

  transitionTo(targetUrl, createHistory) {
    console.log("Transition to: ", targetUrl);

    // TODO: Extremely brittle. Expecting parts of form: /~~/pages/nutalk + /show
    fetch(targetUrl + ".htm", {credentials: "same-origin"}).then((res) => {
      return res.text();
    }).then((resText) => {
      if (createHistory) {
        window.history.pushState({}, null, targetUrl);
      }
      document.querySelectorAll(this.domRoot)[0].innerHTML = resText;
      this.instantiateReactComponents();
    });
  }

  registerAnchorListeners() {
    window.document.addEventListener('click', (e) => {
      // Walk the DOM node's parents to find 'a' tags up the chain
      var el = e.target;
      while (el && el.tagName != 'A') {
        el = el.parentNode;
      }
      // If you find an "a" tag in the clicked element's parents, it's a link
      if (el) {
        var href = el.getAttribute('href');

        // TODO: *Extremely* rough way of detecting an external link...
        if (href.indexOf('.') === -1) {
          e.preventDefault();
          var targetUrl = this.pageRoot + href;
          this.transitionTo(targetUrl, true);
        }
      }
    });
  }

  registerHistoryListeners() {
    window.onpopstate = (state) => {
      this.transitionTo(window.location.href, false);
    }
  }
}
