import React, { Component } from 'react';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ""
    };

    this.filterChange = this.filterChange.bind(this);
  }

  filterChange(evt) {
    console.log('evt = ', evt);
    this.setState({
      filter: evt.target.value
    });
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

        if (prevName !== msg.aut) {
          autLabel = `~${msg.aut}`;
          prevName = msg.aut;
        }

        return (
          <li key={msg.uid} className={`row ${appClass}`}>
            <div className="col-sm-2">
              {autLabel}
            </div>
            <div className="col-sm-10">
              {msg.sep.lin.msg}
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

    return (
      <div>
        <a href="/~~/pages/nutalk/stream/create">
          <button className="btn btn-secondary" type="button">Create Stream →</button>
        </a>
        <a href="/~~/pages/nutalk/collection/create">
          <button className="btn btn-tetiary" type="button">Create Collection →</button>
        </a>
        <div className="row">
          <input className="mt-4 w-80" type="text" value={this.state.filter} onChange={this.filterChange} placeholder="Filter..." />
        </div>
        <div className="text-mono mt-8">
          {stationElems}
        </div>
      </div>
    );
  }
}
