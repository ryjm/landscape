import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';
import { UrbitApi } from './urbit-api';
import { UrbitWarehouse } from './urbit-warehouse';
import { util } from './util';

export class UrbitRouter {
  constructor() {
    // TODO: Fix this later to not suck.
    // this.pageRoot = "/~~/pages/nutalk/";

    this.pageRoot = "";
    this.domRoot = "#root";

    // TODO: This... might be a circular dependency? Seems to work though.
    this.warehouse = new UrbitWarehouse(this.instantiateReactComponents.bind(this));
    this.api = new UrbitApi(this.warehouse);
    this.pendingTransitions = [];

    this.instantiateReactComponents();
    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  instantiateReactComponents() {
    if (this.warehouse.pendingTransition) {
      this.transitionTo(this.warehouse.pendingTransition.target);
      this.warehouse.pendingTransition = null;
    }

    // clear header
    let headerElem = document.querySelectorAll('[data-component-header]')[0];
    ReactDOM.render(<div />, headerElem);

    let componentElements = document.querySelectorAll('[data-component]');

    componentElements.forEach((elem) => {
      // grab the name of the component
      let componentName = elem.dataset.component;

      // look up the component type in component-map, instantiate it
      let component = React.createElement(ComponentMap[componentName].comp, {
        api: this.api,
        store: this.warehouse.store,
        storeData: this.warehouse.storeData.bind(this.warehouse),
        queryParams: util.getQueryParams()
      });

      ReactDOM.render(component, elem);

      if (ComponentMap[componentName].head) {
        let headerComponent = React.createElement(ComponentMap[componentName].head, {
          queryParams: util.getQueryParams(),
        });

        ReactDOM.render(headerComponent, headerElem);
      }
    });
  }

  transitionTo(targetUrl, noHistory) {

    // trim queryparams
    let q = targetUrl.indexOf('?');
    let baseUrl = (q !== -1) ? targetUrl.substr(0, q) : targetUrl;

    console.log("Transition to: ", baseUrl);

    // TODO: Extremely brittle. Expecting parts of form: /~~/pages/nutalk + /show
    fetch(baseUrl + ".htm", {credentials: "same-origin"}).then((res) => {
      return res.text();
    }).then((resText) => {
      if (!noHistory) {
        window.history.pushState({}, null, targetUrl);
      }
      document.querySelectorAll(this.domRoot)[0].innerHTML = resText;
      this.instantiateReactComponents();
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
      if (el) {
        let href = el.getAttribute('href');

        // TODO: *Extremely* rough way of detecting an external link...
        if (href.indexOf('.') === -1) {
          e.preventDefault();
          let targetUrl = this.pageRoot + href;
          this.transitionTo(targetUrl);
        }
      }
    });
  }

  registerHistoryListeners() {
    window.onpopstate = (state) => {
      this.transitionTo(window.location.href, true);
    }
  }
}
