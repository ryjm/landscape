import React, { Component } from 'react';
import { util } from '../../util';

export class StreamCreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streamDiscoverable: "no"
    };

    this.createStream = this.createStream.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }

  createStream() {
    this.props.api.sendHallAction({
      create: {
        nom: this.state.streamName,
        des: this.state.streamType,
        sec: this.state.streamSecurity
      }
    });
  }

  valueChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="create-stream-page container">
        <div className="input-group">
          <label htmlFor="streamName">Name</label>
          <input
            type="text"
            name="streamName"
            placeholder="Secret club"
            onChange={this.valueChange}
            value={this.state.streamName}/>
        </div>

        <div className="input-group">
          <label htmlFor="stream-type">Type</label>
          <div className="row">
            <div className="col-sm-6">
              <div className="select-dropdown">
                <select
                  name="streamType"
                  value={this.state.streamType}
                  onChange={this.valueChange}>

                  <option value="feed">Feed</option>
                  <option value="chat">Chat</option>
                  <option value="list">List</option>
                </select>
                <span className="select-icon">↓</span>
              </div>
            </div>
            <div className="col-sm-offset-1 col-sm-5">
              <i className="text-sm">A Feed is a time-ordered (newest-first) list of microblogging messages with character limits.</i>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="stream-security">Security model</label>
          <div className="row">
            <div className="col-sm-6">
              <div className="select-dropdown">
                <select
                  name="streamSecurity"
                  value={this.state.streamSecurity}
                  onChange={this.valueChange}>

                  <option value="village">Village</option>
                  <option value="channel">Channel</option>
                  <option value="journal">Journal</option>
                  <option value="mailbox">Mailbox</option>
                </select>
                <span className="select-icon">↓</span>
              </div>
            </div>
            <div className="col-sm-offset-1 col-sm-5">
              <i className="text-sm">A Village is privately readable and writable, with a whitelist for inviting.</i>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="stream-ships">Whitelist</label>
          <textarea
            name="streamShips"
            placeholder="~ravmel-rodpyl, ~sorreg-namtyv"
            value={this.state.streamShips}
            onChange={this.valueChange}
            />
        </div>

        <div className="input-group">
          <h5>Discoverable?</h5>

          <label htmlFor="stream-discoverable-yes">Yes
            <input
              type="radio"
              name="streamDiscoverable"
              value="yes"
              id="stream-discoverable-yes"
              checked={this.state.streamDiscoverable === "yes"}
              onChange={this.valueChange}/>
          </label>

          <label htmlFor="stream-discoverable-no">No
            <input
              type="radio"
              name="streamDiscoverable"
              value="no"
              id="stream-discoverable-no"
              checked={this.state.streamDiscoverable === "no"}
              onChange={this.valueChange}/>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" onClick={this.createStream}>Create →</button>
      </div>
    )
  }
}
