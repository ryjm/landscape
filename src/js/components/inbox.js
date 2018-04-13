import React, { Component } from 'react';
import { prettyShip, foreignUrl } from '../util';
import { api } from '../urbit-api';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      feed: "",
      collections: {}
    };

    this.filterChange = this.filterChange.bind(this);
    this.feedChange = this.feedChange.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);
    this.addFeed = this.addFeed.bind(this);
  }

  filterChange(evt) {
    this.setState({
      filter: evt.target.value
    });
  }

  feedChange(evt) {
    this.setState({
      feed: evt.target.value
    });
  }

  inviteIsDM(cir) {
    let host = cir.split('/')[0].substr(1);
    let station = cir.split('/')[1];

    return (
      cir.indexOf('.') !== -1 &&
      station.indexOf(host) !== -1
    );
  }

  createDMStation(cir) {
    let dmName = cir.split("/")[1];
    let everyoneElse = dmName.split(".").filter((ship) => ship !== api.authTokens.ship);

    this.props.api.hall({
      create: {
        nom: dmName,
        des: "dm",
        sec: "village"
      }
    });

    this.props.pushPending("circles", {
      type: "subscribe-inbox",
      data: {
        cir: `~${api.authTokens.ship}/${dmName}`
      }
    });

    this.props.pushPending("circle.config.dif.full", {
      type: "transition",
      data: {
        target: `/~~/pages/nutalk/stream?station=~${api.authTokens.ship}/${dmName}`
      }
    });

    this.props.pushPending("circle.config.dif.full", {
      type: "fill-dms",
      data: {
        aud: everyoneElse,
        nom: cir
      }
    });
  }

  acceptInvite(evt) {
    let cir = evt.target.dataset.cir;
    let val = evt.target.attributes.value;

    if (val === "no") {
      return;
    }

    if (this.inviteIsDM(cir)) {
      this.createDMStation(cir);
    } else {
      this.subCircle(cir);
    }
  }

  addFeed(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.subCircle(this.state.feed);
    this.setState({feed: ""});
  }

  subCircle(cir) {
    this.props.api.hall({
      source: {
        nom: "inbox",
        sub: true,
        srs: [cir]
      }
    });

    this.props.pushPending("circle.config.dif.source", {
      type: "transition",
      data: {
        target: `/~~/pages/nutalk/stream?station=${cir}`
      }
    });
  }

  // parses the tac, which is the attached message to the collections update
  collUpdateParse(str) {
    const lim = 100;
    const wain = str.split('\n');
    const hed = wain.filter((l) => l.startsWith('# '));
    const talwain = hed.length > 0 ? wain.slice(1, 5) : wain.slice(0, 4);
    const tal = talwain.join('\n');
    // dumb word count
    const words = tal.split(' ');
    const wc = words.length;
    const more = wc > lim;
    return {
      more,
      head: hed.length > 0 ? hed[0].substr(2) : '',
      tail: more ? words.slice(0, lim).join(' ') : words.join(' '),
    }
  }

  // parse
  stationIdParse(sn) {
    const collMeta = /(.*)\/collection_~(~.*)/.exec(sn);
    return {
      ship: collMeta[1],
      coll: collMeta[2]
    }
  }

  // render a message on a collection circle that
  renderCollectionUpdate(str, sn) {
    const collUpdate = this.collUpdateParse(str);
    const collMeta = this.stationIdParse(sn);
    if (collUpdate.more) {
      return (
        <div>
          <a href={foreignUrl(collMeta.ship, api.authTokens.ship, `/~~/collections/${collMeta.coll}`)} className="text-600">{collUpdate.head}</a>
          <p>{collUpdate.tail} <a href="">[...]</a></p>
          <a href={foreignUrl(collMeta.ship, api.authTokens.ship, `/~~/collections/${collMeta.coll}`)}>More →</a>
        </div>
      );

    } else {
      return (
        <div>
          <a href="" className="text-600">{collUpdate.head}</a>
          <p>{collUpdate.tail}</p>
        </div>
      );
    }
  }

  render() {
    const inboxMessages = this.props.store.messages;
    const inboxKeys = Object.keys(inboxMessages).filter(k => k.indexOf(this.state.filter) !== -1);

    const stationElems = inboxKeys.map((stationName) => {
      let prevName = "";
      let invitePresent = false;

      let messageElems = inboxMessages[stationName].messages.map((msg) => {
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

    let olderStations = Object.keys(this.props.store.configs).map(cos => {
      if (inboxKeys.indexOf(cos) === -1) {
        if (cos.indexOf('collection_') > -1) {
          const collId = this.stationIdParse(cos);
          //
          return (
            <div className="mb-4" key={cos}>
              <a href={foreignUrl(collId.ship, api.authTokens.ship, `/~~/collections/${collId.coll}`)}><b><u>{prettyShip(collId.ship)}/{this.props.store.configs[cos]['cap']}</u></b></a>
            </div>
          )
        } else {
          return (
            <div className="mb-4" key={cos}>
              <a href={`/~~/pages/nutalk/stream?station=${cos}`}><b><u>{cos}</u></b></a>
            </div>
          )
        }
      }
    });

    return (
      <div>
        <a href="/~~/pages/nutalk/stream/create">
          <button className="btn btn-secondary" type="button">Create Stream →</button>
        </a>
        <a href="/~~/pages/nutalk/collection/create">
          <button className="btn btn-tetiary" type="button">Create Collection →</button>
        </a>
        <form className="inline-block" onSubmit={this.addFeed}>
          <input className="w-51 inbox-feed" type="text" value={this.state.feed} onChange={this.feedChange} placeholder="Add feed: ~marzod/club" />
        </form>
        <div className="row">
          <input className="mt-4 w-80 input-sm" type="text" value={this.state.filter} onChange={this.filterChange} placeholder="Filter..." />
        </div>
        <div className="text-mono mt-8">
          {stationElems}
        </div>
        <h3 className="mt-8">Older stations</h3>
        {olderStations}
      </div>
    );
  }
}
