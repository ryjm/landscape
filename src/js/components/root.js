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
          localGet: this.props.localGet,
          localSet: this.props.localSet,
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
    // Example metadata:

    // <input type="hidden"
    //   name="urb-metadata"
    //   urb-show="default"
    //   urb-path="/web/collections/~2018.8.28..19.59.32..0013/~2018.8.28..21.49.27..6131"
    //   urb-name="New post yet again"
    //   urb-owner="~zod"
    //   urb-date-created="~2018.8.28..21.49.27..6131"
    //   urb-last-modified="~2018.8.28..21.49.27..6131"
    //   urb-content-type="blog"
    //   urb-structure-type="collection-post">

    let headerQuery = tempDOM.querySelectorAll('[name="urb-metadata"]');
    let headerData = {
      type: "default"
    }

    if (headerQuery.length > 0) {
      headerData.type = headerQuery[0].getAttribute('urb-structure-type');
      headerData.subtype = headerQuery[0].getAttribute('urb-show');

      if (headerData.type.includes("collection")) {
        headerData.type = `${headerData.type}-${headerData.subtype}`
      }
    }

    if (headerQuery.length > 0 && headerData.type) {
      headerData.owner = headerQuery[0].getAttribute('urb-owner');
      headerData.host = headerQuery[0].getAttribute('urb-host');
      headerData.pageTitle = headerQuery[0].getAttribute('urb-name');
      headerData.dateCreated = headerQuery[0].getAttribute('urb-date-created');
      headerData.dateModified = headerQuery[0].getAttribute('urb-date-modified');
      headerData.collPath = headerQuery[0].getAttribute('urb-path');

      if (headerData.type.includes("collection-index")) {
        headerData.title = headerData.pageTitle;
        headerData.collId = headerData.dateCreated;
        headerData.collTitle = headerData.title;
        headerData.station = `${headerData.host}/c-${headerData.collId}`;
      }

      if (headerData.type.includes("collection-post")) {
        headerData.title = headerData.pageTitle;
        headerData.collId = headerData.collPath.split("/")[3];
        headerData.collTitle = headerData.collId;
        headerData.postId = headerData.dateCreated;
        headerData.station = `${headerData.host}/c-${headerData.collId}-${headerData.postId}`;

        let collCircle = `${headerData.owner}/c-${headerData.collId}`;
        let collConfig = warehouse.store.configs[collCircle];
        headerData.collTitle = collConfig && collConfig.extConf ? collConfig.extConf.name : headerData.collId;
      }

      if (headerData.type === "stream-chat") {
        headerData.station = getQueryParams().station;
        if (!headerData.station) return;
        headerData.title = headerData.station.split("/")[1];
      }
    }

    return (
      <Header
        data={headerData}
        api={this.props.api}
        store={this.props.store}
        storeReports={this.props.storeReports}
        pushCallback={this.props.pushCallback}
        transitionTo={this.props.transitionTo}
        localSet={this.props.localSet}
        localGet={this.props.localGet}
        runPoll={this.props.runPoll}
      />
    );
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
      let tempDOM = parser.parseFromString(this.props.scaffold, "text/html");
      content = (
        <React.Fragment>
          {this.loadHeader(tempDOM)}
          {this.reactify()}
        </React.Fragment>
      )
    }

    return content;
  }
}
