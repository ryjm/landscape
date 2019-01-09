import React, { Component } from 'react';
import { isDMStation, getMessageContent } from '/lib/util';
import { Button } from '/components/lib/button';
import { getStationDetails } from '/services';
import { PAGE_STATUS_TRANSITIONING, REPORT_PAGE_STATUS } from '/lib/constants';

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
    let stationDetails = getStationDetails(station);

    this.props.api.hall({
      source: {
        nom: 'inbox',
        sub: true,
        srs: [station]
      }
    });

    this.props.storeReports([{
      type: REPORT_PAGE_STATUS,
      data: PAGE_STATUS_TRANSITIONING
    }]);

    this.props.pushCallback("circle.config.dif.source", (rep) => {
      this.props.transitionTo(`/~~/landscape/stream?station=${station}`);
    });
  }

  acceptInvite(actionData) {
    if (actionData.response === "no") {
      return;
    }

    if (isDMStation(actionData.station)) {
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
          <span className="text-body">invite to {this.props.details.content.cir}...</span>
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
            <img src={this.props.details.content} style={{width:"30%"}}></img>
          )
        }
        else {
          return (
            <a href={this.props.details.content} target="_blank">{this.props.details.content}</a>
          )
        }
    } else if (this.props.details.type === "exp") {
      return (
        <div className="text-body">
          <div className="text-mono">{this.props.details.content}</div>
          <pre className="text-mono mt-0">{this.props.details.res}</pre>
        </div>
      )
    } else if (['new item', 'edited item'].includes(this.props.details.type)) {
      return <span className="text-body" dangerouslySetInnerHTML={{__html: this.props.details.snip}}></span>
    } else if (this.props.details.type === "lin") {
      return <span className="text-body">{this.props.details.content}</span>
    }

    return <span className="text-mono">{'<unknown message type>'}</span>;
  }
}
