import React, { Component } from 'react';
import { Header } from '/components/header';
import HtmlToReact from 'html-to-react';
import { ComponentMap } from '/lib/component-map';
import { getQueryParams } from '/lib/util';

export class Root extends Component {
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
          storeReports: this.props.storeReports,
          pushCallback: this.props.pushCallback,
          transitionTo: this.props.transitionTo,
          queryParams: this.props.queryParams,
        }, propsObj));
      }
    }, {
      shouldProcessNode: () => true,
      processNode: this.htmlParserNodeDefinitions.processDefaultNode
    }];

    return this.htmlParser.parseWithInstructions(this.props.scaffold, () => true, instructions);
  }

  render() {
    let parser = new DOMParser();
    let tempDOM = parser.parseFromString(this.props.scaffold, "text/xml");
    let headerQuery = tempDOM.querySelectorAll('[name="urb-header"]');
    let header = (headerQuery.length > 0) ? headerQuery[0].getAttribute('value') : "default";
    let headerData = {
      title: (headerQuery.length > 0) ? headerQuery[0].getAttribute('title') : null,
      station: (headerQuery.length > 0) ? headerQuery[0].getAttribute('station') : null,
      postid: (headerQuery.length > 0) ? headerQuery[0].getAttribute('postid') : null,
    }

    headerData.station = (headerData.station === "query") ? getQueryParams().station : headerData.station;

    let children = this.reactify();

    return (
      <div>
        <Header
          type={header}
          data={headerData}
          api={this.props.api}
          store={this.props.store}
          storeReports={this.props.storeReports}
          pushCallback={this.props.pushCallback}
          transitionTo={this.props.transitionTo}
        />
        {children}
      </div>
    )
  }
}
