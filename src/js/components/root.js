import React, { Component } from 'react';
import { Header } from '/components/header';
import HtmlToReact from 'html-to-react';
import { ComponentMap } from '/lib/component-map';
import { getQueryParams } from '/lib/util';
import { CommandMenu } from '/components/command';

export class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };

    // Required to convert arbitrary HTML into React elements
    this.htmlParser = HtmlToReact.Parser();
    this.htmlParserNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

    props.pushCallback("menu.toggle", (rep) => {
      let newStatus = (rep.data) ? rep.data.open : !this.state.menuOpen;

      this.setState({
        menuOpen: newStatus
      });

      return false;
    });
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

        return React.createElement(ComponentMap[componentName], Object.assign({
          api: this.props.api,
          store: this.props.store,
          storeReports: this.props.storeReports,
          pushCallback: this.props.pushCallback,
          transitionTo: this.props.transitionTo,
          queryParams: getQueryParams(),
        }, propsObj));
      }
    }, {
      shouldProcessNode: () => true,
      processNode: this.htmlParserNodeDefinitions.processDefaultNode
    }];

    return this.htmlParser.parseWithInstructions(this.props.scaffold, () => true, instructions);
  }

  loadHeader(tempDOM) {
    let headerQuery = tempDOM.querySelectorAll('[name="urb-header"]');
    let headerData = {
      type: (headerQuery.length > 0) ? headerQuery[0].getAttribute('value') : "default",
      title: (headerQuery.length > 0) ? headerQuery[0].getAttribute('title') : null,
      station: (headerQuery.length > 0) ? headerQuery[0].getAttribute('station') : null,
      postid: (headerQuery.length > 0) ? headerQuery[0].getAttribute('postid') : null,
      ship: (headerQuery.length > 0) ? headerQuery[0].getAttribute('ship') : null,
      publ: (headerQuery.length > 0) ? headerQuery[0].getAttribute('publ') : null,
    }

    headerData.station = (headerData.station === "query") ? getQueryParams().station : headerData.station;

    return (
      <Header
        data={headerData}
        api={this.props.api}
        store={this.props.store}
        storeReports={this.props.storeReports}
        pushCallback={this.props.pushCallback}
        transitionTo={this.props.transitionTo}
      />
    )
  }

  render() {
    let content;

    if (this.state.menuOpen) {
      content = (
        <CommandMenu
          api={this.props.api}
          store={this.props.store}
          storeReports={this.props.storeReports}
          pushCallback={this.props.pushCallback}
          transitionTo={this.props.transitionTo}
        />
      )
    } else {
      let parser = new DOMParser();
      let tempDOM = parser.parseFromString(this.props.scaffold, "text/xml");
      content = (
        <div>
          {this.loadHeader(tempDOM)}
          {this.reactify()}
        </div>
      )
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}
