import React, { Component } from 'react';

export class CreateStreamPage extends Component {
  render() {
    return (
      <div className="create-stream-page container">
        <div className="input-group">
          <label for="stream-name">Name</label>
          <input type="text" name="stream-name" placeholder="Secret club"/>
        </div>

        <div className="input-group">
          <label for="stream-type">Type</label>
          <div className="row">
            <div className="col-sm-6">
              <div className="select-dropdown">
                <select name="stream-type">
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
          <label for="stream-security">Security model</label>
          <div className="row">
            <div className="col-sm-6">
              <div className="select-dropdown">
                <select name="stream-security">
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
          <label for="stream-ships">Whitelist</label>
          <textarea name="stream-ships" placeholder="~ravmel-rodpyl, ~sorreg-namtyv"/>
        </div>

        <div className="input-group">
          <label for="stream-discoverable">Discoverable</label>
          <button type="button" className="btn btn-default" value="yes">Yes</button>
          <button type="button" className="btn btn-tertiary" value="no">No</button>
        </div>

        <button type="submit" className="btn btn-primary">Create →</button>
      </div>
    )
  }
}
