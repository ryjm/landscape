import React, { Component } from 'react';
import { IconBlog } from './icons/icon-blog';
import { getQueryParams } from './util';
import { api } from './urbit-api';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleSubscribe = this.toggleSubscribe.bind(this);
  }

  stationName() {
    return `${this.props.data.ship}/collection_~${this.props.data.id}`;
  }

  isSubscribed() {
    let inbox = this.props.store.configs[`~${api.authTokens.ship}/inbox`];
    if (!inbox) return false;
    return inbox.src.includes(this.stationName());
  }

  toggleSubscribe() {
    let subscribed = this.isSubscribed();

    api.hall({
      source: {
        nom: "inbox",
        sub: !subscribed,
        srs: [this.stationName()]
      }
    });
  }

  getContent() {
    let subscribeButton = (this.isSubscribed()) ?
      (<button type="button" onClick={this.toggleSubscribe} className="btn btn-sm btn-secondary">Unsubscribe</button>) :
      (<button type="button" onClick={this.toggleSubscribe} className="btn btn-sm btn-primary">Subscribe</button>);

    switch(this.props.type) {
      case "collection-index":
        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8"><IconBlog /></div>
              <h3>{this.props.data.title}</h3>
            </div>
            <div className="flex align-center">
              <a href="/~~/details" className="header-link mr-6">Details</a>
              {subscribeButton}
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
