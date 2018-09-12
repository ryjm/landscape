import React, { Component } from 'react';
import { IconBlog } from '/components/lib/icons/icon-blog';
import { IconStream } from '/components/lib/icons/icon-stream';
import { IconInbox } from '/components/lib/icons/icon-inbox';
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
      case "stream":
        defaultData = this.getStationHeaderData(this.props.data.station);
        headerData = {
          ...defaultData,
          icon: IconStream,
          title: {
            ...defaultData.title,
            style: "mono"
          },
          actions: {
            details: defaultData.stationDetails.stationDetailsUrl,
          },
        }
        break;

      case "collection-index":
        defaultData = this.getStationHeaderData(this.props.data.station);

        if (this.props.data.collectionPageMode === 'default') {
          actions = {
            details: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}?show=details`,
            write: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}?show=post`,
          }
        } else if (this.props.data.collectionPageMode === 'details') {
          actions = {
            back: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}`,
          }
        }

        headerData = {
          ...defaultData,
          icon: IconBlog,
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
            details: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}/${this.props.data.postId}?show=details`,
            edit: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}/${this.props.data.postId}?show=edit`
          }
        } else if (this.props.data.collectionPageMode === 'details') {
          actions = {
            back: `/~~/${this.props.data.owner}/==/web/collections/${this.props.data.collId}/${this.props.data.postId}`,
          }
        }

        headerData = {
          ...defaultData,
          icon: IconBlog,
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
          title: {
            display: this.props.data.owner,
            href: profileUrl(this.props.data.owner.substr(1)),
            style: "mono"
          }
        }
        break;

      case "dm":
      case "edit":
      case "header-inbox":
        headerData = {
          title: {
            display: "Inbox",
            href: "/~~/landscape"
          },
          icon: IconInbox,
          type
        }
        break;
      case "default":
      default:
        headerData = {
          title: {
            display: "Inbox",
            href: "/~~/landscape"
          },
          icon: IconInbox
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
            <div className="flex-col-x">
              <a className={recentClass} onClick={() => { this.navigateSubpage('inbox', 'inbox-recent') }}>Recent</a>
              <a className={allClass} onClick={() => { this.navigateSubpage('inbox', 'inbox-all') }}>All</a>
            </div>
          </React.Fragment>
        );

        break;
    }
  }

  buildHeaderContent(headerData) {
    let actions, subscribeClass, subscribeLabel, iconElem, breadcrumbsElem,
    headerClass, loadingClass, headerCarpet;

    if (headerData.station) {
      subscribeClass = (this.isSubscribed(headerData.station)) ? "btn-secondary" : "btn-primary";
      subscribeLabel = (this.isSubscribed(headerData.station)) ? "Unsubscribe" : "Subscribe";
    }

    if (headerData.actions) {
      actions = Object.arrayify(headerData.actions).map(({key, value}) => {
        return (<a key={key} href={value} className="header-link mr-6">{key}</a>)
      })
    }

    if (headerData.breadcrumbs) {
      breadcrumbsElem = headerData.breadcrumbs.map(({display, href}, i) => {
        return (
          <React.Fragment>
            <a className="header-link header-link-breadcrumb" key={display} href={href}>{display}</a>
            <span className="header-link header-link-breadcrumb ml-2 mr-2">/</span>
          </React.Fragment>
        )
      })
    }

    iconElem = headerData.icon ? <headerData.icon /> : <div style={{width: "24px", height: "24px"}}></div>;
    loadingClass = getLoadingClass(this.props.store.views.transition);
    headerClass = classnames({
      'flex-col-x': true,
      'header-title': true,
      'header-title-mono': headerData.title && headerData.title.style === "mono"
    })

    headerCarpet = this.buildHeaderCarpet(headerData);

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
          <div className="flex-col-1 flex space-between">
            <a onClick={this.toggleMenu}>
              <div className="icon-panini"></div>
            </a>
            <span style={{'marginRight': "12px"}}>{iconElem}</span>
          </div>
          <h3 className={headerClass}>
            <a href={headerData.title.href}>{headerData.title.display}</a>
          </h3>
          {actions}
          {headerData.station &&
            <Button
              classes={`btn btn-sm ${subscribeClass}`}
              action={this.toggleSubscribe}
              content={subscribeLabel}
              pushCallback={this.props.pushCallback}
              responseKey="circle.config.dif.source"
               />
          }
        </div>
        <div className="row header-carpet text-squat">
          {headerCarpet}
        </div>
      </div>
    )
  }

  render() {
    let type = (this.props.data.type) ? this.props.data.type : "default";

    // TODO: This is an ugly hack until we fix queryParams
    if (["stream", "dm", "collection-write"].includes(type) && !getQueryParams().station) {
      return null;
    }

    let headerData = this.getHeaderData(type);
    let headerContent = this.buildHeaderContent(headerData);

    return headerContent;
  }
}
