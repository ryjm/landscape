import React, { Component } from 'react';
import { Elapsed } from '/components/lib/elapsed';
import { Message } from '/components/lib/message';
import { prettyShip, isDMStation, getStationDetails, getMessageContent } from '/lib/util';
import { Icon } from '/components/lib/icon';
import _ from 'lodash';

export class InboxRecentPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      feed: "",
      collections: {}
    };

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

  buildSectionContent(section) {
    let lastAut = "";

    let messageRows = section.msgs.map((msg, i) => {
      let messageDetails = getMessageContent(msg);
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
              <span className="text-mono"><a className="shipname" href={prettyShip(msg.aut)[1]}>{prettyShip(`~${msg.aut}`)[0]}</a></span>
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
              <Message details={messageDetails} api={this.props.api} storeReports={this.props.storeReports} pushCallback={this.props.pushCallback} transitionTo={this.props.transitionTo}></Message>
            </div>
          </div>
        </div>
      )
    });

    return messageRows;
  }

  // TODO:  This function is super bunk. Post circles should (probably) have post title in the post config.
  findPostTitleFromMessage(postId) {
    let inbox = this.props.store.messages.inboxMessages;
    let result = null;

    for (var i = 0; i < inbox.length; i++) {
      inbox[i].aud.forEach((aud) => {
        if (aud.includes(postId)) {
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
          <a href={section.details.hostProfileUrl} className="text-700 text-mono underline">~{section.details.host}</a>
          <span className="ml-2 mr-2">/</span>
        </span>
      );

      let postDisplay = null;

      if (section.details.type === "text-topic") {
        let postTitle = this.findPostTitleFromMessage(section.details.postId);

        postDisplay = (
          <span>
            <span className="ml-2 mr-2">/</span>
            <a href={section.details.postUrl} className="text-700 underline">{postTitle}</a>
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
              <a href={section.details.stationUrl} className="text-700 underline">{section.details.stationTitle}</a>
              {postDisplay}
            </div>
          </div>
          {sectionContent}
        </div>
      )
    })
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
      let aud = msg.aud[0];

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

    return sectionElems;
  }
}
