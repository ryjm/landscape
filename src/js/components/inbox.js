import React, { Component } from 'react';
import { Elapsed } from './common/elapsed';
import { prettyShip, foreignUrl, isDMStation, getStationDetails, getMessageContent } from '../util';
import { Icon } from './common/icon';
import _ from 'lodash';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      feed: "",
      collections: {}
    };

    this.acceptInvite = this.acceptInvite.bind(this);
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

    this.props.pushCallback("circle.config.dif.full", (rep) => {
      window.router.transitionTo(`/~~/pages/nutalk/stream?station=~${this.props.api.authTokens.ship}/${circle}`);
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

  acceptInvite(evt) {
    let station = evt.target.dataset.station;
    let val = evt.target.attributes.value;

    if (val === "no") {
      return;
    }

    if (isDMStation(station)) {
      this.createDMStation(station);
    } else {
      this.subStation(station);
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

    this.props.pushCallback("circle.config.dif.source", (rep) => {
      window.router.transitionTo(`/~~/pages/nutalk/stream?station=${station}`);
    });
  }

  buildPostTitle(messageDetails) {
    if (messageDetails.postURL) {
      return (
        <a className="pr-12 text-600 underline"
          href={messageDetails.postURL}>
          {messageDetails.postTitle}
        </a>
      )
    } else {
      return null;
    }
  }

  buildMessageContent(messageDetails) {
    if (messageDetails.type === "text") {
      return this.buildPostTitle(messageDetails);
    } else if (messageDetails.type === "inv") {
      return (
        <div className="invite">
          {messageDetails.content}
          <button className="btn btn-primary accept" onClick={this.acceptInvite} data-station={messageDetails.station}>Yes</button>
          <button className="btn btn-secondary decline">No</button>
        </div>
      )
    } else if (messageDetails.type === "url") {
        if (/(jpg|img|png|gif|tiff|jpeg|JPG|IMG|PNG|TIFF)$/.exec(messageDetails.content)) {
          return (
            <img src={messageDetails.content}></img>
          )
        }
        else {
          return (
            <a href={messageDetails.content}>{messageDetails.content}</a>
          )
        }
    } else {
      return messageDetails.content;
    }
  }

  buildSectionContent(section) {
    let lastAut = "";

    let messageRows = section.msgs.map((msg, i) => {
      let messageDetails = getMessageContent(msg, section.details);
      let rowAuthor = null;

      if (lastAut !== msg.aut) {
        let topicLink = this.buildPostTitle(messageDetails);
        let timestamp = (i === 0) ? (<div className="timestamp"><Elapsed timestring={msg.wen} /></div>) : null;

        rowAuthor = (
          <div className="row mt-3">
            <div className="col-sm-1 col-sm-offset-1">
              {timestamp}
            </div>
            <div className="col-sm-10">
              <span>{topicLink}</span>
              <span className="text-mono">~{msg.aut}</span>
            </div>
          </div>
        );
      }

      lastAut = msg.aut;

      return (
        <div key={i}>
          {rowAuthor}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-2">
              {this.buildMessageContent(messageDetails)}
            </div>
          </div>
        </div>
      )
    });

    return messageRows;
  }

  // TODO:  This function is super bunk. Post circles should (probably) have post title in the post config.
  findPostTitleFromMessage(postID) {
    let inbox = this.props.store.messages.inboxMessages;
    let result = null;

    for (var i = 0; i < inbox.length; i++) {
      inbox[i].aud.forEach((aud) => {
        if (aud.includes(postID)) {
          result = inbox[i].sep.fat.sep.lin.msg.split("|")[1];
        }
      })
    }

    return result;
  }

  buildSections(sections) {
    return sections.map((section, i) => {
      let sectionContent = this.buildSectionContent(section);
      let hostDisplay = (section.details.type === "dm") ? null : (
        <span>
          <a href={section.details.hostProfileURL} className="text-700 text-mono underline">~{section.details.host}</a>
          <span className="ml-2 mr-2">/</span>
        </span>
      );

      let postDisplay = null;

      if (section.details.type === "text-topic") {
        let postTitle = this.findPostTitleFromMessage(section.details.postID);

        postDisplay = (
          <span>
            <span className="ml-2 mr-2">/</span>
            <a href={section.details.postURL} className="text-700 underline">{postTitle}</a>
          </span>
        )
      }

      return (
        <div className="mt-9 mb-4" key={i}>
          <div className="row">
            <div className="col-sm-1 col-sm-offset-1">
              <Icon className="inbox-icon" type={section.details.type} />
            </div>
            <div className="col-sm-10">
              {hostDisplay}
              <a href={section.details.stationURL} className="text-700 underline">{section.details.stationTitle}</a>
              {postDisplay}
            </div>
          </div>
          {sectionContent}
        </div>
      )
    })
  }

  trimAudiences(aud) {
    if (aud.length === 1) {
      return aud[0];
    } else if (isDMStation(aud[0])) {
      let circle = aud[0].split("/")[1];
      return `~${this.props.api.authTokens.ship}/${circle}`;
    } else {
      console.log("~~~ Error : Multiple audiences, probably inbox ~~~");
      return aud[0];
    }
  }

  // Group inbox messages by time-chunked stations, strictly ordered by message time.
  // TODO:  Inbox does not handle messages with multiple audiences very well
  getSectionData() {
    let inbox = this.props.store.messages.inboxMessages;

    let lastStationName = [];
    let sections = [];
    let stationIndex = -1;

    for (var i = 0; i < inbox.length; i++) {
      let msg = inbox[i];
      let aud = this.trimAudiences(msg.aud);

      if (!_.isEqual(aud, lastStationName)) {
        sections.push({
          name: aud,
          msgs: [msg],
          details: getStationDetails(aud, this.props.store.configs[aud], this.props.api.authTokens.ship)
        });
        stationIndex++;
      } else {
        sections[stationIndex].msgs.push(msg);
      }

      lastStationName = aud;
    }

    return sections;
  }

  render() {
    const sections = this.getSectionData();
    const sectionElems = this.buildSections(sections);

    return (
      <div className="inbox-page container">
        {sectionElems}
      </div>
    );
  }
}
