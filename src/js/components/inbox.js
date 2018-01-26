import React, { Component } from 'react';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  buildInbox() {
    var messages = this.props.store.messages;
    var stations = this.props.store.stations;

    let fullStations = stations;

    for (var station in fullStations) {
      fullStations[station].messages = [];
    }

    messages.forEach((msg) => {
      fullStations[msg.aud].messages.push(msg);
    })

    return fullStations;
  }

  render() {
    const inbox = this.buildInbox();
    const stationElems = Object.keys(inbox).map((stationName) => {
      const messageElems = inbox[stationName].messages.map((msg) => {
        return (
          <li key={msg.uid} className="row">
            <div className="col-sm-2">
              {msg.aut}
            </div>
            <div className="col-sm-10">
              {msg.msg}
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
        <div className="text-mono mt-8">
          {stationElems}
        </div>
      </div>
    );
  }
}
