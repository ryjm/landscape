import React, { Component } from 'react';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      feed: ""
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

  acceptInvite(evt) {
    let cir = evt.target.dataset.cir;
    let val = evt.target.attributes.value;

    this.subCircle(cir, val);
  }

  addFeed(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.subCircle(this.state.feed, true);
    this.setState({feed: ""});
  }

  subCircle(cir, sub) {
    this.props.api.hall({
      source: {
        nom: "inbox",
        sub: sub,
        srs: [cir]
      }
    })
  }

  render() {
    console.log(this.state.filter);

    const inboxMessages = this.props.store.messages;
    const inboxKeys = Object.keys(inboxMessages).filter(k => k.indexOf(this.state.filter) !== -1);

    const stationElems = inboxKeys.map((stationName) => {
      let prevName = "";

      const messageElems = inboxMessages[stationName].messages.map((msg) => {
        let appClass = msg.app ? " chat-msg-app" : "";

        let autLabel = "";
        let message = "";

        if (prevName !== msg.aut) {
          autLabel = `~${msg.aut}`;
          prevName = msg.aut;
        }

        if (msg.sep.lin) {
          message = msg.sep.lin.msg;
        } else if (msg.sep.inv && !this.props.store.configs[msg.sep.inv.cir]) {
          message = (
            <span className="ml-4">
              <span>Invite to <b>{msg.sep.inv.cir}</b>. Would you like to join?</span>
              <span className="text-500 underline ml-2 mr-2" onClick={this.acceptInvite} value="yes" data-cir={msg.sep.inv.cir}>Yes</span>
              <span className="text-500 underline ml-2 mr-2" onClick={this.acceptInvite} value="no" data-cir={msg.sep.inv.cir}>No</span>
            </span>
          );
        }

        return (
          <li key={msg.uid} className={`row ${appClass}`}>
            <div className="col-sm-2">
              {autLabel}
            </div>
            <div className="col-sm-10">
              {message}
            </div>
          </li>
        );
      });

      return (
        <div className="mb-4" key={stationName}>
          <a href={`/~~/pages/nutalk/stream?station=${stationName}`}><b><u>{stationName}</u></b></a>
          <ul>
            {messageElems}
          </ul>
        </div>
      );
    });

    let olderStations = Object.keys(this.props.store.configs).map(cos => {
      if (inboxKeys.indexOf(cos) === -1) {
        return (
          <div className="mb-4" key={cos}>
            <a href={`/~~/pages/nutalk/stream?station=${cos}`}><b><u>{cos}</u></b></a>
          </div>
        )
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
