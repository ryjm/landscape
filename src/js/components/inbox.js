import React, { Component } from 'react';
import { prettyShip, foreignUrl } from '../util';
import { isDMStation } from '../util';
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

    this.props.pushPending("circles", {
      type: "subscribe-inbox",
      data: {
        cir: `~${this.props.api.authTokens.ship}/${circle}`
      }
    });

    this.props.pushPending("circle.config.dif.full", {
      type: "transition",
      data: {
        target: `/~~/pages/nutalk/stream?station=~${this.props.api.authTokens.ship}/${circle}`
      }
    });

    this.props.pushPending("circle.config.dif.full", {
      type: "permit",
      data: {
        nom: circle,
        aud: everyoneElse,
        message: false
      }
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

    this.props.pushPending("circle.config.dif.source", {
      type: "transition",
      data: {
        target: `/~~/pages/nutalk/stream?station=${station}`
      }
    });
  }

  buildStationElems() {
    const inboxMessages = this.props.store.messages.inboxMessages;

    Object.keys(inboxMessages).map((stationName) => {
      let prevName = "";
      let invitePresent = false;

      let messageElems = inboxMessages.map((msg) => {
        let appClass = msg.app ? " chat-msg-app" : "";

        let autLabel = "";
        let message = "";

        if (prevName !== msg.aut) {
          autLabel = prettyShip(`~${msg.aut}`);
          prevName = msg.aut;
        }

        if (msg.sep.inv && !this.props.store.configs[msg.sep.inv.cir]) {
          invitePresent = true;

          message = (
            <span className="ml-4">
              <span>Invite to <b>{msg.sep.inv.cir}</b>. Would you like to join?</span>
              <span className="text-500 underline ml-2 mr-2 pointer" onClick={this.acceptInvite} value="yes" data-cir={msg.sep.inv.cir}>Yes</span>
              <span className="text-500 underline ml-2 mr-2 pointer" onClick={this.acceptInvite} value="no" data-cir={msg.sep.inv.cir}>No</span>
            </span>
          );
        } else if (!this.props.store.configs[stationName]) {  // If message isn't sourced by inbox & is not an invite, render nothing
          return null;
        } else if (msg.sep.fat && msg.sep.fat.tac.text) {  // This is an update on a collection circle
          message = this.renderCollectionUpdate(msg.sep.fat.tac.text, stationName);
        } else if (msg.sep.lin) {
          message = msg.sep.lin.msg;
        }

        return (
          <li key={msg.uid} className={`row ${appClass}`}>
            <div className="col-sm-3">
              {autLabel}
            </div>
            <div className="col-sm-9">
              {message}
            </div>
          </li>
        );
      });

      // Filter out messages set to "null" in last step, messages that aren't sourced from inbox
      messageElems = messageElems.filter(elem => (elem !== null));
      if (messageElems.length > 0) {
        // a collection-based circle
        if (stationName.indexOf('collection_') > -1) {
          const collId = this.stationIdParse(stationName);
          // need to work on how collection updates are sent to hall
          return (
            <div className="mb-4" key={stationName}>
              <a href={`/~~/collections/${collId.coll}`}><b><u>{prettyShip(collId.ship)}/{this.props.store.configs[stationName]['cap']}</u></b></a>
              <ul>
                {messageElems}
              </ul>
            </div>
          );
        } else {
          return (
            <div className="mb-4" key={stationName}>
              <a href={`/~~/pages/nutalk/stream?station=${stationName}`}><b><u>{stationName}</u></b></a>
              <ul>
                {messageElems}
              </ul>
            </div>
          );
        }
      } else {
        return null;
      }
    });
  }

  buildSectionElems(sections) {
    return sections.map((section) => {
      return (
        <div className="row">
          <div className="col-sm-1 col-sm-offset-1">

          </div>
          <div className="col-sm-10">

          </div>
        </div>
      )
    })
  }

  getSectionType(section) {
    if (section.includes("inbox")) return "inbox";
    if (section.includes("collection")) return "text";
    if (isDMStation(section)) return "dm";

    let config = this.props.store.configs[section];
    if (config && config.cap === "chat") return "chat";
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
  buildSections() {
    let inbox = this.props.store.messages.inboxMessages;

    let lastStationName = [];
    let sections = [];
    let stationIndex = -1;

    for (var i = 0; i < inbox.length; i++) {
      let msg = inbox[i];
      let aud = this.trimAudiences(msg.aud);

      if (!_.isEqual(aud, lastStationName)) {
        let sectionType = this.getSectionType(aud);

        sections.push({
          name: aud,
          msgs: [msg]
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
    // const stationElems = this.buildStationElems();
    const sections = this.buildSections();
    const sectionElems = this.buildSectionElems(sections);

    // let olderStations = Object.keys(this.props.store.configs).map(cos => {
    //   if (inboxKeys.indexOf(cos) === -1) {
    //     if (cos.indexOf('collection_') > -1) {
    //       const collId = this.stationIdParse(cos);
    //       //
    //       return (
    //         <div className="mb-4" key={cos}>
    //           <a href={foreignUrl(collId.ship, this.props.api.authTokens.ship, `/~~/collections/${collId.coll}`)}><b><u>{prettyShip(collId.ship)}/{this.props.store.configs[cos]['cap']}</u></b></a>
    //         </div>
    //       )
    //     } else {
    //       return (
    //         <div className="mb-4" key={cos}>
    //           <a href={`/~~/pages/nutalk/stream?station=${cos}`}><b><u>{cos}</u></b></a>
    //         </div>
    //       )
    //     }
    //   }
    // });

    // <div className="icon-chat"></div>
    // <div className="icon-text"></div>
    // <div className="icon-text">
    //   <div className="icon-text-topic"></div>
    // </div>
    // <div className="icon-dm"></div>

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-1 col-sm-offset-1">

          </div>


          <div className="text-mono mt-4">
            {sectionElems}
          </div>
        </div>
      </div>
    );
  }
}
