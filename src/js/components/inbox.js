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
      fullStations[msg.station].messages.push(msg);
    })

    return fullStations;
  }

  render() {
    const inbox = this.buildInbox();

    console.log("inbox = ", inbox);

    const stationElems = Object.keys(inbox).map((stationName) => {
      console.log('inbox @ ', stationName, ' = ', inbox[stationName]);

      const messageElems = inbox[stationName].messages.map((msg) => {
        return (
          <li key={msg.uid} className="row">
            <div className="col-sm-2">
              {msg.author}
            </div>
            <div className="col-sm-10">
              {msg.body}
            </div>
          </li>
        );
      });

      return (
        <div className="mb-4">
          <b><u>{stationName}</u></b>
          <ul>
            {messageElems}
          </ul>
        </div>
      );
    });

    return (
      <div className="text-mono mt-8">
        {stationElems}
      </div>
    );
  }
}
