import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';

export class UrbitRouter {
  constructor() {
    // TODO: Fix this later to not suck.
    // this.pageRoot = "/~~/pages/nutalk/";
    this.pageRoot = "";

    this.domRoot = "#root";

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
      var component = React.createElement(ComponentMap[componentName]);
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
