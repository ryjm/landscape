import React, { Component } from 'react';
import { IconBlog } from './icons/icon-blog';
import { getQueryParams, normalizeForeignURL, getStationDetails } from './util';
import { api } from './urbit-api';
import { Button } from './common/button';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleSubscribe = this.toggleSubscribe.bind(this);
  }

  isSubscribed() {
    let inbox = this.props.store.configs[`~${api.authTokens.ship}/inbox`];
    if (!inbox) return false;
    return inbox.src.includes(this.props.data.station);
  }

  toggleSubscribe() {
    let subscribed = this.isSubscribed();

    api.hall({
      source: {
        nom: "inbox",
        sub: !subscribed,
        srs: [this.props.data.station]
      }
    });
  }

  getContent() {
    let btnClass = (this.isSubscribed()) ? " btn-secondary" : " btn-primary";
    let btnLabel = (this.isSubscribed()) ? "Unsubscribe" : "Subscribe";

    switch(this.props.type) {
      case "collection":
        let station = this.props.data.station;
        let stationDetails = getStationDetails(station, this.props.store.configs[station], api.authTokens.ship);
        let collectionURL = normalizeForeignURL(`collections/${stationDetails.collId}`);
        let title = (this.props.data.title) ? this.props.data.title : stationDetails.stationTitle;
        let authed = (stationDetails.host === `${api.authTokens.ship}`);
        let actionLink = null;

        if (authed) {
          actionLink = (this.props.data.postid) ?
            (<a href={normalizeForeignURL(`collections/${stationDetails.collId}/${this.props.data.postid}.collections-edit`)} className="header-link mr-6">Edit</a>) :
            (<a href={`/~~/pages/nutalk/collection/post?station=~${stationDetails.host}/collection_~${stationDetails.collId}`} className="header-link mr-6">Write</a>)
        }

        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8"><IconBlog /></div>
              <h3><a href={collectionURL}>{title}</a></h3>
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
      default:
      return (
        <div className="flex">
          <div className="flex align-center">
            <a href="/~~/pages/nutalk/menu" className="mr-22">
              <div className="panini"></div>
            </a>
            <div className="mr-8"><div style={{width: "18px", height: "18px"}}></div></div>
            <h3>Inbox</h3>
            <span className="ml-16"><i>Try using "cmd+k" to open the menu.</i></span>
          </div>
        </div>
      )
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
