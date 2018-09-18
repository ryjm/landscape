/*
  Data structure:
    common: {
      host: zod,
      hostProfileUrl: (...)/~zod/profile,

      cir: [@ta/dmjoin]

      station: [host]/[circle]
      stationUrl: [streamUrl/collIndexUrl]

      subcircle: @ta
      subcircleUrl: (...)collIndexUrl/subcircle

      type: {"dm", "chat", "fora"}
    }

    Breadcrumb display:
      [host] [circle* /coll@ta [*]/dmjoin *] [...subcollection]

      case "dm":
        <span mono *>[dmjoin]</span>

    dm:

*/


import React, { Component } from 'react';
import { Elapsed } from '/components/lib/elapsed';
import { Message } from '/components/lib/message';
import { prettyShip, isDMStation, getMessageContent } from '/lib/util';
import { getStationDetails } from '/services';
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
      if (messageDetails.contentType === "comments") {

        return (
          <a className="pr-12 text-600 underline"
            href={messageDetails.parentUrl}>
            {messageDetails.parentTitle}  /  comment
          </a>
        )

      } else {
        return (
          <a className="pr-12 text-600 underline"
            href={messageDetails.postUrl}>
            {messageDetails.postTitle}
          </a>
        )
      }
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
        // TODO: Add timestamp back in later maybe
        // let timestamp = (i === 0) ? (<div className="text-timestamp"><Elapsed timestring={msg.wen} /></div>) : null;

        rowAuthor = (
          <div className="row">
            <div className="flex-col-2"></div>
            <div className="flex-col-x">
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
            <div className="flex-col-2"></div>
            <div className="flex-col-x">
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
    let inbox = this.props.store.messages.inbox.messages;
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
          <a href={section.details.hostProfileUrl} className="text-600 text-mono underline">~{section.details.host}</a>
          <span className="ml-2 mr-2">/</span>
        </span>
      );

      let postDisplay = null;

      if (section.details.type === "collection-index") {
        let postTitle = section.details.stationTitle;
        postDisplay = (
          <span>
            <span className="ml-2 mr-2">/</span>
            <a href={section.details.postUrl} className="text-600 underline">{postTitle}</a>
          </span>
        )
      }

      return (
        <div className="mt-4 mb-6" key={i}>
          <div className="row align-center">
            <div className="flex-col-1"></div>
            <div className="flex-col-1 flex justify-end">
              <Icon type={section.details.type} />
            </div>
            <div className="flex-col-x">
              {hostDisplay}
              <a href={section.details.stationUrl} className="text-600 underline">{section.details.stationTitle}</a>
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
    let inbox = this.props.store.messages.inbox.messages;

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
          details: getStationDetails(aud)
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
