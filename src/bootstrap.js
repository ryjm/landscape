import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';

console.log("sup!");

class UrbitRouter {
  constructor() {
    this.registerAnchorListeners();
    this.pageRoot = "/~~/pages/nutalk";
    this.domRoot = "#root";

    this.instantiateReactComponents();

    console.log('awefa');
  }

  transitionTo(href) {
    console.log("Transitioning");
    // TODO: Extremely brittle. Expecting parts of form: /~~/pages/nutalk + /show
    var targetUrl = this.pageRoot + href + ".htm";

    console.log('path = ', targetUrl);

    fetch(targetUrl, {credentials: "same-origin"}).then((res) => {
      var text = res.text()
      console.log('htmlText = ', text);
      return text;
    }).then((resText) => {
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
          this.transitionTo(href);
        }
      }
    });
  }

  instantiateReactComponents() {
    var componentElements = document.querySelectorAll('[data-component]');

    console.log('componentElements.len = ', componentElements.length);

    componentElements.forEach((elem) => {
      // grab the name of the component
      var componentName = elem.dataset.component;
      // look up the component type in component-map, instantiate it
      var component = React.createElement(ComponentMap[componentName]);
      console.log("comp = ", component);
      console.log("elem = ", elem);
      ReactDOM.render(component, elem);
    });
  }
}

window.runapp = () => {
  var router = new UrbitRouter();
}
