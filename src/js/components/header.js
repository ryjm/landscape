import React, { Component } from 'react';
import { IconBlog } from '/components/lib/icons/icon-blog';
import { IconStream } from '/components/lib/icons/icon-stream';
import { getQueryParams, getStationDetails, collectionAuthorization, profileUrl } from '/lib/util';
import { Button } from '/components/lib/button';
import { TRANSITION_LOADING } from '/lib/constants';
import _ from 'lodash';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleSubscribe = this.toggleSubscribe.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.type !== this.props.data.type) {
      return true;
    }

    return false;
  }

  isSubscribed(station) {
    let inbox = this.props.store.configs[`~${this.props.api.authTokens.ship}/inbox`];
    if (!inbox) return false;
    return inbox.src.includes(station);
  }

  toggleSubscribe(station) {
    let subscribed = this.isSubscribed(station);

    this.props.api.hall({
      source: {
        nom: "inbox",
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

  getHeaderData(type) {
    let headerData = {};

    switch (type) {
      case "stream":
        let station = this.props.data.station;
        let stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);

        headerData = {
          title: {
            display: stationDetails.stationTitle,
            href: stationDetails.stationUrl,
            style: "mono"
          },
          actions: {
            details: stationDetails.stationDetailsUrl,
          },
          breadcrumbs: [{
            display: `~${stationDetails.host}`,
            href: stationDetails.hostProfileUrl
          }],
          station: station,
          icon: IconStream
        }
        break;

      case "dm":
      case "collection":
      case "edit":
      case "profile":
      case "default":
      default:
        headerData = {
          title: {
            display: "Inbox",
            href: "/~~/pages/nutalk"
          }
        }
        break;
    }

    return headerData;
  }

  buildHeaderContent(headerData) {
    let actions, subscribeClass, subscribeLabel, iconElem, breadcrumbsElem, headerClass;

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

    if (headerData.title) {
      headerClass = headerData.title.style === "mono" ? "header-title header-title-mono" : "header-title";
    }

    return (
      <div>
        <div className="row">
          <div className="col-sm-offset-2 col-sm-10 mb-0">
            {breadcrumbsElem}
          </div>
        </div>
        <div className="flex align-center">
          <a onClick={this.toggleMenu} className="header-icon-menu">
            <div className="panini"></div>
          </a>
          <div className="header-icon-page">{iconElem}</div>
          <h3 className={headerClass}><a href={headerData.title.href}>{headerData.title.display}</a></h3>
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
      </div>
    )
  }

  // getContent() {
  //   let btnClass = (this.isSubscribed()) ? " btn-secondary" : " btn-primary";
  //   let btnLabel = (this.isSubscribed()) ? "Unsubscribe" : "Subscribe";
  //   let headerIcon, station, stationDetails, actionLink;
  //
  //   let type = (this.props.data.type) ? this.props.data.type : "default";
  //
  //     case "collection":
  //       station = this.props.data.station;
  //       if (!station) return null;
  //       stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);
  //       let title = (this.props.data.title) ? this.props.data.title : stationDetails.stationTitle;
  //       let authorization = collectionAuthorization(stationDetails, this.props.api.authTokens.ship);
  //       headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <IconBlog />;
  //
  //       if (stationDetails.host === this.props.api.authTokens.ship || this.props.data.publ === "%.y") {
  //         actionLink = (this.props.data.postid) ?
  //           (<a href={`/~~/~${stationDetails.host}/==/web/collections/${stationDetails.collId}/${this.props.data.postid}?edit=true`} className="header-link mr-6">Edit</a>) :
  //           (<a href={`/~~/pages/nutalk/collection/post?station=~${stationDetails.host}/collection_~${stationDetails.collId}`} className="header-link mr-6">Write</a>)
  //       }
  //
  //       return (
  //         <div className="flex space-between">
  //           <div className="flex align-center">
  //             <a onClick={this.toggleMenu} className="mr-22">
  //               <div className="panini"></div>
  //             </a>
  //             <div className="mr-8">{headerIcon}</div>
  //             <h3><a href={stationDetails.stationUrl}>{title}</a></h3>
  //           </div>
  //           <div className="flex align-center">
  //             {actionLink}
  //             <Button
  //               classes={`btn btn-sm${btnClass}`}
  //               action={this.toggleSubscribe}
  //               content={btnLabel}
  //               pushCallback={this.props.pushCallback}
  //               responseKey="circle.config.dif.source"
  //                />
  //           </div>
  //         </div>
  //       )
  //       break;
  //     // just duplicated collections logic here because we might want more controls for edit mode later
  //     case "edit":
  //       station = this.props.data.station;
  //       if (!station) return null;
  //       stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);
  //       title = (this.props.data.title) ? this.props.data.title : stationDetails.stationTitle;
  //       authorization = collectionAuthorization(stationDetails, this.props.api.authTokens.ship);
  //       headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <IconBlog />;
  //
  //       if (stationDetails.host === this.props.api.authTokens.ship || this.props.data.publ === "%.y") {
  //         actionLink = (<a href={`/~~/~${stationDetails.host}/==/web/collections/${stationDetails.collId}/${this.props.data.postid}`} className="header-link mr-6">Cancel</a>);
  //       }
  //
  //       return (
  //         <div className="flex space-between">
  //           <div className="flex align-center">
  //             <a onClick={this.toggleMenu} className="mr-22">
  //               <div className="panini"></div>
  //             </a>
  //             <div className="mr-8">{headerIcon}</div>
  //             <h3><a href={stationDetails.stationUrl}>{title}</a></h3>
  //           </div>
  //           <div className="flex align-center">
  //             {actionLink}
  //             <Button
  //               classes={`btn btn-sm${btnClass}`}
  //               action={this.toggleSubscribe}
  //               content={btnLabel}
  //               pushCallback={this.props.pushCallback}
  //               responseKey="circle.config.dif.source"
  //                />
  //           </div>
  //         </div>
  //       )
  //       break;
  //     case "profile":
  //       return (
  //         <div className="flex">
  //           <div className="flex align-center">
  //             <a onClick={this.toggleMenu} className="mr-22">
  //               <div className="panini"></div>
  //             </a>
  //             <div className="mr-8">{headerIcon}</div>
  //             <h3><a href={profileUrl(this.props.data.ship)}>Profile</a></h3>
  //           </div>
  //         </div>
  //       )
  //       break;
  //     default:
  //       return this.defaultHeader();
  //       break;
  //   }
  // }

  render() {
    let type = (this.props.data.type) ? this.props.data.type : "default";

    console.log('header type = ', type);

    let headerData = this.getHeaderData(type);
    let headerContent = this.buildHeaderContent(headerData);

    return (
      <div className="container header-container">
        {headerContent}
      </div>
    )
  }
}
