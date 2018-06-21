import React, { Component } from 'react';
import { IconBlog } from '/components/lib/icons/icon-blog';
import { IconStream } from '/components/lib/icons/icon-stream';
import { getQueryParams, getStationDetails, collectionAuthorization } from '/lib/util';
import { Button } from '/components/lib/button';
import { TRANSITION_LOADING } from '/lib/constants';
import _ from 'lodash';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleSubscribe = this.toggleSubscribe.bind(this);
  }

  isSubscribed() {
    let inbox = this.props.store.configs[`~${this.props.api.authTokens.ship}/inbox`];
    if (!inbox) return false;
    return inbox.src.includes(this.props.data.station);
  }

  toggleSubscribe() {
    let subscribed = this.isSubscribed();

    this.props.api.hall({
      source: {
        nom: "inbox",
        sub: !subscribed,
        srs: [this.props.data.station]
      }
    });
  }

  defaultHeader() {
    let headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <div style={{width: "24px", height: "24px"}}></div>;
    return (
      <div className="flex">
        <div className="flex align-center">
          <a href="/~~/pages/nutalk/menu" className="mr-22">
            <div className="panini"></div>
          </a>
          <div className="mr-8">{headerIcon}</div>
          <h3><a href={`/~~/pages/nutalk`}>Inbox</a></h3>
          <span className="ml-16"><i>Try using "cmd+k" to open the menu.</i></span>
        </div>
      </div>
    );
  }

  getContent() {
    let btnClass = (this.isSubscribed()) ? " btn-secondary" : " btn-primary";
    let btnLabel = (this.isSubscribed()) ? "Unsubscribe" : "Subscribe";
    let headerIcon, station, stationDetails, actionLink;

    let type = (this.props.data.type) ? this.props.data.type : "default";

    switch(type) {
      case "stream":
        station = this.props.data.station;
        if (!station) return null;
        stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);
        headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <IconStream />;

        if (stationDetails.host === this.props.api.authTokens.ship) {
          actionLink = (<a href={`/~~/pages/nutalk/stream/edit?station=${station}`} className="header-link mr-6">Edit</a>);
        }

        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8">{headerIcon}</div>
              <h3><a href={stationDetails.stationUrl}>{stationDetails.cir}</a></h3>
            </div>
            <div className="flex align-center">
              {actionLink}
              <Button
                classes={`btn btn-sm${btnClass}`}
                action={this.toggleSubscribe}
                content={btnLabel}
                pushCallback={this.props.pushCallback}
                responseKey="circle.config.dif.source"
                 />
            </div>
          </div>
        )
        break;
      case "collection":
        station = this.props.data.station;
        if (!station) return null;
        stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);
        let title = (this.props.data.title) ? this.props.data.title : stationDetails.stationTitle;
        let authorization = collectionAuthorization(stationDetails, this.props.api.authTokens.ship);
        headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <IconBlog />;

        if (stationDetails.host === this.props.api.authTokens.ship || this.props.data.publ === "%.y") {
          actionLink = (this.props.data.postid) ?
            (<a href={`/~~/~${stationDetails.host}/==/web/collections/${stationDetails.collId}/${this.props.data.postid}?edit=true`} className="header-link mr-6">Edit</a>) :
            (<a href={`/~~/pages/nutalk/collection/post?station=~${stationDetails.host}/collection_~${stationDetails.collId}`} className="header-link mr-6">Write</a>)
        }

        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8">{headerIcon}</div>
              <h3><a href={stationDetails.stationUrl}>{title}</a></h3>
            </div>
            <div className="flex align-center">
              {actionLink}
              <Button
                classes={`btn btn-sm${btnClass}`}
                action={this.toggleSubscribe}
                content={btnLabel}
                pushCallback={this.props.pushCallback}
                responseKey="circle.config.dif.source"
                 />
            </div>
          </div>
        )
        break;
      // just duplicated collections logic here because we might want more controls for edit mode later
      case "edit":
        station = this.props.data.station;
        if (!station) return null;
        stationDetails = getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship);
        title = (this.props.data.title) ? this.props.data.title : stationDetails.stationTitle;
        authorization = collectionAuthorization(stationDetails, this.props.api.authTokens.ship);
        headerIcon = (this.props.store.views.transition === TRANSITION_LOADING) ? <div className="btn-spinner btn-spinner-lg">◠</div> : <IconBlog />;

        if (stationDetails.host === this.props.api.authTokens.ship || this.props.data.publ === "%.y") {
          actionLink = (<a href={`/~~/~${stationDetails.host}/==/web/collections/${stationDetails.collId}/${this.props.data.postid}`} className="header-link mr-6">Cancel</a>);
        }

        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8">{headerIcon}</div>
              <h3><a href={stationDetails.stationUrl}>{title}</a></h3>
            </div>
            <div className="flex align-center">
              {actionLink}
              <Button
                classes={`btn btn-sm${btnClass}`}
                action={this.toggleSubscribe}
                content={btnLabel}
                pushCallback={this.props.pushCallback}
                responseKey="circle.config.dif.source"
                 />
            </div>
          </div>
        )
        break;
      case "profile":
        return (
          <div className="flex">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8">{headerIcon}</div>
              <h3><a href={`/~~/${this.props.data.ship}/==/web/pages/nutalk/profile`}>Profile</a></h3>
            </div>
          </div>
        )
        break;
      default:
        return this.defaultHeader();
        break;
    }
  }

  render() {
    return (
      <div className="header-container">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              {this.getContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
