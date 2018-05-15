import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMap } from './component-map';
import { UrbitWarehouse } from './urbit-warehouse';
import { UrbitOperator } from './urbit-operator';
import HtmlToReact from 'html-to-react';
import { getQueryParams } from './util';
import { api } from './urbit-api';

export class UrbitRouter {
  constructor() {
    this.pageRoot = "";
    this.domRoot = "#root";

    this.warehouse = new UrbitWarehouse(this.renderRoot.bind(this));
    this.operator = new UrbitOperator(this.warehouse);

    this.scaffold = document.querySelectorAll("#root")[0].innerHTML;
    this.renderRoot();

    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  renderRoot() {
    this.setHeader(null);

    let rootComponent = (
      <RootComponent
        store={this.warehouse.store}
        pushPending={this.warehouse.pushPending}
        queryParams={getQueryParams()}
        setHeader={this.setHeader}
        scaffold={this.scaffold} />
    )

    ReactDOM.render(rootComponent, document.querySelectorAll("#root")[0]);
  }

  setHeader(headerElem) {
    if (!headerElem) {
      headerElem = (
        <div className="flex align-center">
          <h3 className="underline text-gray">
            <a href="/~~/pages/nutalk">Inbox</a>
          </h3>
          <span className="ml-15"><i>"Try using cmd+k to open the menu"</i></span>
        </div>
      );
    }

    ReactDOM.render(headerElem, document.querySelectorAll("[urb-component-header]")[0]);
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
      if (el && el.hostname === "localhost") {
        e.preventDefault();
        this.transitionTo(el.pathname + el.search);
      }
    });
  }

  registerHistoryListeners() {
    window.onpopstate = (state) => {
      this.transitionTo(window.location.href, true);
    }
  }
}

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
          api: api,
          store: this.props.store,
          pushPending: this.props.pushPending,
          queryParams: this.props.queryParams,
          setHeader: this.props.setHeader
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
