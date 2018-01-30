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
    const stationElems = Object.keys(inboxMessages).map((stationName) => {
      const messageElems = inboxMessages[stationName].messages.map((msg) => {
        let appClass = msg.app ? " chat-msg-app" : "";

        return (
          <li key={msg.uid} className={`row ${appClass}`}>
            <div className="col-sm-2">
              {msg.aut}
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
        <input type="text" value={this.state.filter} onChange={this.filterChange} placeholder="Filter..." />
        <a href="/~~/pages/nutalk/stream/create">
          <button className="btn btn-secondary" type="button">Create Stream →</button>
        </a>
        <a href="/~~/pages/nutalk/collection/create">
          <button className="btn btn-tetiary" type="button">Create Collection →</button>
        </a>
        <div className="text-mono mt-8">
          {stationElems}
        </div>
      </div>
    );
  }
}
