import React, { Component } from 'react';
import { Icon } from '/components/lib/icon';
import { getQueryParams, profileUrl, getLoadingClass } from '/lib/util';
import { getStationDetails } from '/services';
import { Button } from '/components/lib/button';
import { REPORT_PAGE_STATUS, REPORT_NAVIGATE, PAGE_STATUS_TRANSITIONING, PAGE_STATUS_READY, PAGE_STATUS_PROCESSING, PAGE_STATUS_RECONNECTING } from '/lib/constants';
import classnames from 'classnames';
import _ from 'lodash';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleSubscribe = this.toggleSubscribe.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.reconnectPolling = this.reconnectPolling.bind(this);
    this.handleHeaderAction = this.handleHeaderAction.bind(this);
  }

  isSubscribed(station) {
    let inboxSrc = this.props.store.messages.inbox.src;
    if (!inboxSrc) return false;
    return inboxSrc.includes(station);
  }

  toggleSubscribe() {
    let subscribed = this.isSubscribed(this.props.data.station);
    let stationDetails = getStationDetails(this.props.data.station);

    this.props.api.hall({
      source: {
        nom: 'inbox',
        sub: !subscribed,
        srs: [this.props.data.station]
      }
    });
  }

  toggleMenu() {
    this.props.storeReports([{
      type: "menu.toggle",
      data: {open: true}
    }]);
  }

  reconnectPolling() {
    this.props.storeReports([{
      type: REPORT_PAGE_STATUS,
      data: PAGE_STATUS_RECONNECTING
    }]);
    this.props.runPoll();
  }

  getStationHeaderData(station) {
    let stationDetails = getStationDetails(station);

    return {
      title: {
        display: stationDetails.stationTitle,
        href: stationDetails.stationUrl
      },
      breadcrumbs: [{
        display: `~${stationDetails.host}`,
        href: stationDetails.hostProfileUrl
      }],
      station,
      stationDetails
    }
  }

  getHeaderData(type) {
    let headerData = {};
    let defaultData;
    let actions = {};

    switch (type) {
      case "stream-chat":
        defaultData = this.getStationHeaderData(this.props.data.station);
        headerData = {
          ...defaultData,
          icon: 'icon-stream-chat',
          title: {
            ...defaultData.title,
            style: "mono"
          },
          actions: {
            subscribe: null,
            details: defaultData.stationDetails.stationDetailsUrl,
          },
        }
        break;

      case "collection-index":
        defaultData = this.getStationHeaderData(this.props.data.station);

        if (this.props.data.collectionPageMode === 'default') {
          actions = {
            write: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}?show=post`,
            subscribe: null,
            details: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}?show=details`,
          }
        }

        headerData = {
          ...defaultData,
          icon: 'icon-collection-index',
          title: {
            ...defaultData.title,
            display: (this.props.data.title) ? this.props.data.title : defaultData.title.display
          },
          actions: actions
        }
        break;

      case "collection-post":
        defaultData = this.getStationHeaderData(this.props.data.station);

        if (this.props.data.collectionPageMode === 'default') {
          actions = {
            edit: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}/${this.props.data.postId}?show=edit`
          }
        }

        headerData = {
          ...defaultData,
          icon: 'icon-collection-post',
          title: {
            ...defaultData.title,
            display: (this.props.data.title) ? this.props.data.title : defaultData.title.display
          },
          breadcrumbs: [
            defaultData.breadcrumbs[0],
            {
              display: this.props.data.collTitle,
              href: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}`
            }
          ],
          actions: actions
        }
        break;

      case "header-profile":
        headerData = {
          icon: 'icon-sig',
          title: {
            display: this.props.data.owner.substr(1),
            href: profileUrl(this.props.data.owner.substr(1)),
            style: "mono"
          }
        }
        break;

      case "stream-dm":
        headerData = {
          icon: 'icon-stream-dm'
        }
        break;
      case "collection-post-edit":
        headerData = {
          icon: 'icon-collection-post'
        }
        break;
      case "header-inbox":
        headerData = {
          title: {
            display: "Inbox",
            href: "/~~/landscape"
          },
          icon: 'icon-inbox',
          type
        }
        break;
      case "header-default":
      default:
        headerData = {
          title: {
            display: "Inbox",
            href: "/~~/landscape"
          },
          icon: 'icon-inbox'
        }
        break;
    }

    return headerData;
  }

  navigateSubpage(page, view) {
    this.props.storeReports([{
      type: REPORT_NAVIGATE,
      data: {page, view}
    }]);
  }

  buildHeaderCarpet(headerData) {
    switch (headerData.type) {
      case "header-inbox":
        let recentClass = classnames({
          'vanilla': true,
          'mr-8': true,
          'inbox-link': true,
          'inbox-link-active': warehouse.store.views.inbox === "inbox-recent",
        });

        let allClass = classnames({
          'vanilla': true,
          'inbox-link': true,
          'inbox-link-active': warehouse.store.views.inbox === "inbox-all",
        });

        return (
          <React.Fragment>
            <div className="flex-col-2"></div>
            <div className="flex-col-x text-heading">
              <a className={recentClass} onClick={() => { this.navigateSubpage('inbox', 'inbox-recent') }}>Recent</a>
              <a className={allClass} onClick={() => { this.navigateSubpage('inbox', 'inbox-all') }}>All</a>
            </div>
          </React.Fragment>
        );

        break;
    }
  }

  buildHeaderBreadcrumbs(headerData) {
    if (headerData.breadcrumbs) {
      return headerData.breadcrumbs.map(({display, href}, i) => {
        return (
          <React.Fragment>
            <a className="vanilla text-300 text-mono text-small" key={display} href={href}>{display}</a>
            <span className="text-300 text-mono text-small ml-2 mr-2">/</span>
          </React.Fragment>
        )
      })
    }

    return null;
  }

  handleHeaderAction(e) {
    if (e.currentTarget.dataset["key"] === "subscribe") {
      e.preventDefault();

      this.props.storeReports([{
        type: REPORT_PAGE_STATUS,
        data: PAGE_STATUS_PROCESSING
      }]);

      this.toggleSubscribe();

      this.props.pushCallback("circle.config.dif.source", rep => {
        this.props.storeReports([{
          type: REPORT_PAGE_STATUS,
          data: PAGE_STATUS_READY
        }]);
      });
    }
  }

  buildHeaderActions(headerData) {
    if (headerData.actions) {
      return Object.arrayify(headerData.actions).map(({key, value}) => {
        let lusElem = null;
        let labelElem = key;
        let subscribeAction = false;

        switch (key) {
          case "details":
            labelElem = (<Icon type="icon-ellipsis" />);
            break;
          case "subscribe":
            labelElem = this.isSubscribed(headerData.station) ? "Unsubscribe" : "Subscribe";
            subscribeAction = true;
            break;
          case "write":
            lusElem = key === "write" ? (<Icon type="icon-lus" iconLabel={true} />) : null;
            break;
        }

        // TODO: No idea why .key and .href aren't showing up in the attributes
        // in currentTarget when you click this. Bad javascript, bad!
        return (
          <a key={key} href={value} onClick={this.handleHeaderAction} data-key={key} className="header-link mr-6 flex align-center">
            {lusElem}
            <span>{labelElem}</span>
          </a>
        );
      })
    }

    return null;
  }

  buildHeaderContent(headerData) {
    let actions, subscribeClass, subscribeLabel, breadcrumbsElem, headerClass,
      loadingClass, headerCarpet;

    actions = this.buildHeaderActions(headerData);
    breadcrumbsElem = this.buildHeaderBreadcrumbs(headerData);
    headerCarpet = this.buildHeaderCarpet(headerData);

    loadingClass = getLoadingClass(this.props.store.views.transition);
    headerClass = classnames({
      'flex-col-x': true,
      'header-title': true,
      'text-mono': headerData.title && headerData.title.style === "mono"
    })

    return (
      <div className="container header-container">
        <div onClick={this.reconnectPolling} className={loadingClass}></div>
        <div className="row">
          <div className="flex-col-2"></div>
          <div className="flex-col-x header-breadcrumbs">
            {breadcrumbsElem}
          </div>
        </div>
        <div className="row align-center header-mainrow">
          <div className="flex-col-1"></div>
          <div className="flex-col-1 flex space-between align-center">
            <a onClick={this.toggleMenu}>
              <Icon type="icon-panini" />
            </a>
            <Icon type={headerData.icon} iconLabel={true} />
          </div>
          <h1 className={headerClass}>
            <a href={headerData.title.href}>{headerData.title.display}</a>
          </h1>
          {actions}
        </div>
        <div className="row header-carpet text-squat">
          {headerCarpet}
        </div>
      </div>
    )
  }

  render() {
    let type = (this.props.data.type) ? this.props.data.type : "header-default";

    // TODO: This is an ugly hack until we fix queryParams
    if (["stream-chat", "header-stream-dm", "collection-edit"].includes(type) && !getQueryParams().station) {
      return null;
    }

    let headerData = this.getHeaderData(type);
    let headerContent = this.buildHeaderContent(headerData);

    return headerContent;
  }
}
