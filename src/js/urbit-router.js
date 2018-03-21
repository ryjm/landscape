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

    this.state = {
      children: this.reactify()
    }
  }

  reactify() {
    let instructions = [{
      replaceChildren: true,
      shouldProcessNode: (node) => {
        return node.attribs && !!node.attribs['data-component']
      },
      processNode: (node) => {
        let componentName = node.attribs['data-component'];
        let propsObj = {};

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

    return this.htmlParser.parseWithInstructions(this.props.rawChildren, () => true, instructions);
  }

  render() {
    return (
      <div>
        <h1>I am root.</h1>
        {this.state.children}
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

    // Required to convert arbitrary HTML into React elements
    this.htmlParser = HtmlToReact.Parser();
    this.htmlParserNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

    // TODO: This... might be a circular dependency? Seems to work though.
    this.warehouse = new UrbitWarehouse(this.renderRoot.bind(this));
    this.api = new UrbitApi(this.warehouse);

    let initialPage = document.querySelectorAll("#root")[0];

    // this.instantiateReactComponents();
    this.reactify(initialPage.innerHTML);
    this.renderRoot();

    this.registerAnchorListeners();
    this.registerHistoryListeners();
  }

  renderRoot() {
    ReactDOM.render(<RootComponent children={this.currentPage} />, document.querySelectorAll("#root")[0]);
  }

  reactify(input) {
    let instructions = [{
      replaceChildren: true,
      shouldProcessNode: (node) => {
        return node.attribs && !!node.attribs['data-component']
      },
      processNode: (node) => {
        let componentName = node.attribs['data-component'];
        let propsObj = {};

        return React.createElement(ComponentMap[componentName].comp, Object.assign({
          api: this.api,
          store: this.warehouse.store,
          storeData: this.warehouse.storeData.bind(this.warehouse),
          queryParams: getQueryParams()
        }, propsObj));
      }
    }, {
      shouldProcessNode: () => true,
      processNode: this.htmlParserNodeDefinitions.processDefaultNode
    }];

    this.currentPage = this.htmlParser.parseWithInstructions(input, () => true, instructions);
    this.renderRoot();
  }

  instantiateReactComponents() {
    // if userhip is null, auth tokens haven't been loaded yet, so api isn't unavablable. so we wait.
    if (this.warehouse.store.usership === "") {
      return;
    }

    if (this.warehouse.pendingTransition) {
      this.transitionTo(this.warehouse.pendingTransition.target);
      this.warehouse.pendingTransition = null;
      return;
    }

    // clear header
    let headerElem = document.querySelectorAll('[data-component-header]')[0];
    ReactDOM.render(<div />, headerElem);

    let componentElements = document.querySelectorAll('[data-component]');

    componentElements.forEach((elem) => {
      // grab the name of the component
      let componentName = elem.dataset.component;

      // all remaining data-* are presumed to be props
      const dataset = elem.dataset
      const propsReducer = (a, v) => {
        const x = {}
        x[v] = dataset[v];
        return Object.assign(a, x);
      }
      const propsObj = Object.keys(elem.dataset)
                      .filter(e => e != 'component')
                      .reduce(propsReducer, {});

      //console.log('propsObj', propsObj);
      // look up the component type in component-map, instantiate it
      let component = React.createElement(ComponentMap[componentName].comp, Object.assign({
        api: this.api,
        store: this.warehouse.store,
        storeData: this.warehouse.storeData.bind(this.warehouse),
        queryParams: getQueryParams()
      }, propsObj));

      ReactDOM.render(component, elem);

      if (ComponentMap[componentName].head) {
        let headerComponent = React.createElement(ComponentMap[componentName].head, {
          queryParams: getQueryParams(),
        });

        ReactDOM.render(headerComponent, headerElem);
      }
    });
  }

  //
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

      // let elem = new DOMParser().parseFromString(resText, "text/html").body.childNodes[0];
      // ReactDOM.render(React.createElement(elem), document.querySelectorAll(this.domRoot)[0]);

      // let htmlInput = '<div><h1>Title</h1><p>A paragraph</p></div>';
      this.reactify(resText);
      this.renderRoot();

      // ReactDOM.render(<RootComponent children={reactElement} />, document.querySelectorAll("#root")[0]);

      // document.querySelectorAll(this.domRoot)[0].innerHTML = resText;
      // this.instantiateReactComponents();
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
