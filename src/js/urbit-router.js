import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';
import { UrbitApi } from './urbit-api';
import { UrbitWarehouse } from './urbit-warehouse';
import HtmlToReact from 'html-to-react';
import { getQueryParams } from './util';

class RootComponent extends Component {
  constructor(props) {
    super(props);

    // Required to convert arbitrary HTML into React elements
    this.htmlParser = HtmlToReact.Parser();
    this.htmlParserNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  }

  reactify() {
    let instructions = [{
      replaceChildren: true,
      shouldProcessNode: (node) => {
        return node.attribs && !!node.attribs['urb-component']
      },
      processNode: (node) => {
        let componentName = node.attribs['urb-component'];
        let propsObj = {};

        Object.keys(node.attribs)
          .filter((key) => key.indexOf('urb-') !== -1 && key !== "urb-component")
          .forEach((key) => {
            let keyName = key.substr(4);  // "urb-timestamp" => "timestamp"
            propsObj[keyName] = node.attribs[key];
          });

        return React.createElement(ComponentMap[componentName].comp, Object.assign({
          api: this.props.api,
          store: this.props.store,
          storeData: this.props.storeData,
          queryParams: this.props.queryParams
        }, propsObj));
      }
    }, {
      shouldProcessNode: () => true,
      processNode: this.htmlParserNodeDefinitions.processDefaultNode
    }];

    return this.htmlParser.parseWithInstructions(this.props.scaffold, () => true, instructions);
  }

  render() {
    let children = this.reactify();

    return (
      <div>
        {children}
      </div>
    )
  }
}

export class UrbitRouter {
  constructor() {
    // TODO: Fix this later to not suck.
    // this.pageRoot = "/~~/pages/nutalk/";
    this.pageRoot = "";
    this.domRoot = "#root";
    this.pendingTransitions = [];

    this.warehouse = new UrbitWarehouse(this.renderRoot.bind(this));
    this.api = new UrbitApi(this.warehouse);

    this.scaffold = document.querySelectorAll("#root")[0].innerHTML;
    this.renderRoot();

    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  renderRoot() {
    // if userhip is null, auth tokens haven't been loaded yet, so api isn't unavablable. so we wait.
    if (this.warehouse.store.usership === "") {
      return;
    }

    // TODO: This is very brittle and bad.
    if (this.warehouse.pendingTransition) {
      this.transitionTo(this.warehouse.pendingTransition.target);
      this.warehouse.pendingTransition = null;
      return;
    }

    let rootComponent = (
      <RootComponent
        api={this.api}
        store={this.warehouse.store}
        storeData={this.warehouse.storeData.bind(this.warehouse)}
        queryParams={getQueryParams()}
        scaffold={this.scaffold} />
    )

    ReactDOM.render(rootComponent, document.querySelectorAll("#root")[0]);
  }

  filterUrl(url) {
    let q = url.indexOf('?');
    var baseUrl;

    // If there are query params, preserve 'em
    if (q !== -1) {
      baseUrl = `${url.substr(0, q)}.htm?${url.substr(q + 1)}`;
    // Don't append .htm if it's a known renderer
    } else if (url.endsWith(".collections-edit")) {
      baseUrl = url;
    // Otherwise append .htm
    } else {
      baseUrl = url + ".htm";
    }
    return baseUrl;
  }

  transitionTo(targetUrl, noHistory) {

    console.log("Transition to: ", this.filterUrl(targetUrl));

    // TODO: Extremely brittle. Expecting parts of form: /~~/pages/nutalk + /show
    fetch(this.filterUrl(targetUrl), {credentials: "same-origin"}).then((res) => {
      return res.text();
    }).then((resText) => {
      if (!noHistory) {
        window.history.pushState({}, null, targetUrl);
      }
      this.scaffold = resText;
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
      if (el) {
        let href = el.getAttribute('href');

        // TODO: *Extremely* rough way of detecting an external link...
        //if (href.indexOf('.') === -1) {
        if (el.hostname === "localhost") {
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
