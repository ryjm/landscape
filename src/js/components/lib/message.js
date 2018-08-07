import React, { Component } from 'react';
import { isDMStation, getMessageContent } from '/lib/util';
import { Button } from '/components/lib/button';
import { CollectionPreview } from '/components/collectionPreview';
import { PAGE_STATUS_TRANSITIONING } from '/lib/constants';

export class Message extends Component {
  constructor(props) {
    super(props);

    this.acceptInvite = this.acceptInvite.bind(this);
  }

  buildPostTitle(messageDetails) {
    if (messageDetails.postUrl) {
      return (
        <a className="pr-12 text-600 underline"
          href={messageDetails.postUrl}>
          {messageDetails.postTitle}
        </a>
      )
    } else {
      return null;
    }
  }

  subStation(station) {
    this.props.api.hall({
      source: {
        nom: "inbox",
        sub: true,
        srs: [station]
      }
    });

    this.props.storeReports([{
      type: "transition",
      data: PAGE_STATUS_TRANSITIONING
    }]);

    this.props.pushCallback("circle.config.dif.source", (rep) => {
      this.props.transitionTo(`/~~/pages/nutalk/stream?station=${station}`);
    });
  }

  createDMStation(station) {
    let circle = station.split("/")[1];
    let everyoneElse = circle.split(".").filter((ship) => ship !== this.props.api.authTokens.ship);

    this.props.api.hall({
      create: {
        nom: circle,
        des: "dm",
        sec: "village"
      }
    });

    this.props.pushCallback("circles", (rep) => {
      api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [`~${this.props.api.authTokens.ship}/${rep.data.cir}`]
        }
      })
    });

    this.props.storeReports([{
      type: "transition",
      data: PAGE_STATUS_TRANSITIONING
    }]);

    this.props.pushCallback("circle.config.dif.full", (rep) => {
      this.props.transitionTo(`/~~/pages/nutalk/stream?station=~${this.props.api.authTokens.ship}/${circle}`);
    });

    this.props.pushCallback("circle.config.dif.full", (rep) => {
      api.permit(circle, everyoneElse, false);
    });

    this.props.pushCallback("circle.config.dif.full", (rep) => {
      api.hall({
        source: {
          nom: circle,
          sub: true,
          srs: [station]
        }
      })
    });
  }

  acceptInvite(actionData) {
    if (actionData.response === "no") {
      return;
    }

    if (isDMStation(actionData.station)) {
      // this.createDMStation(actionData.station);
      console.log('~~~ ERROR: dm station invites should be automatically accepted ~~~');
    } else {
      this.subStation(actionData.station);
    }
  }

  render() {
    if (this.props.details.type === "text") {
      return this.buildPostTitle(this.props.details);
    } else if (this.props.details.type === "inv") {
      return (
        <div className="invite">
          invite to {this.props.details.content}...
          <Button
            classes="btn btn-primary accept"
            action={this.acceptInvite}
            actionData={{station: this.props.details.content, response: "yes"}}
            pushCallback={this.props.pushCallback}
            responseKey="circle.config.dif.full"
            content="Yes"
           />

          <button className="btn btn-secondary decline">No</button>
        </div>
      )
    } else if (this.props.details.type === "url") {
        if (/(jpg|img|png|gif|tiff|jpeg|JPG|IMG|PNG|TIFF)$/.exec(this.props.details.content)) {
          return (
            <img src={this.props.details.content} style={{width:"100%"}}></img>
          )
        }
        else {
          return (
            <a href={this.props.details.content} target="_blank">{this.props.details.content}</a>
          )
        }
    } else if (this.props.details.type === "exp") {
      return (
        <div>
          <div className="text-mono">{this.props.details.content}</div>
          <pre className="text-mono mt-0">{this.props.details.res}</pre>
        </div>
      )
    } else if (this.props.details.type === 'new item') {

      return <CollectionPreview messageDetails={this.props.details} api={this.props.api}></CollectionPreview>
    } else if (this.props.details.type === "lin") {
      return this.props.details.content;
    }

    return "<unknown message type>";
  }
}
