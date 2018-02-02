import React, { Component } from 'react';
import { util } from '../../util';

export class StreamCreatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      stream: {
        nom: "",
        des: "chat",
        sec: "village",
        dis: "no",
        aud: [],
        audRaw: []
      }
    };

    this.createStream = this.createStream.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }

  createStream() {
    let usership = this.props.store.usership;

    this.props.api.hall({
      create: {
        nom: this.state.stream.nom,
        des: this.state.stream.des,
        sec: this.state.stream.sec
      }
    }, {
      target: `/~~/pages/nutalk/stream?station=~${usership}/${this.state.stream.nom}`
    });

    this.setState({
      loading: true
    });

    this.props.storeData({
      pendingInvites: [{
        aud: this.state.stream.aud,
        nom: this.state.stream.nom
      }]
    });
  }

  valueChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    let stream = {
      [name]: value
    };

    if (name === "audRaw") {
      stream.aud = value.split([", "])
    }

    console.log("stream? = ",this.state.stream, stream);

    this.setState({
      stream: Object.assign(this.state.stream, stream)
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <div className="create-stream-page container">
            <div className="input-group">
              <label htmlFor="nom">Name</label>
              <input
                type="text"
                name="nom"
                placeholder="Secret club"
                disabled={this.state.loading}
                onChange={this.valueChange}
                value={this.state.stream.nom}/>
            </div>

            <div className="input-group">
              <label htmlFor="stream-type">Type</label>
              <div className="row">
                <div className="col-sm-6">
                  <div className="select-dropdown" disabled={this.state.loading}>
                    <select
                      name="des"
                      disabled={this.state.loading}
                      value={this.state.stream.des}
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
                  <div className="select-dropdown" disabled={this.state.loading}>
                    <select
                      name="sec"
                      disabled={this.state.loading}
                      value={this.state.stream.sec}
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
                name="audRaw"
                placeholder="~ravmel-rodpyl, ~sorreg-namtyv"
                disabled={this.state.loading}
                value={this.state.stream.audRaw}
                onChange={this.valueChange}
                />
            </div>

            <div className="input-group">
              <h5>Discoverable?</h5>

              <label htmlFor="stream-discoverable-yes" disabled={this.state.loading}>Yes
                <input
                  type="radio"
                  name="dis"
                  value="yes"
                  id="stream-discoverable-yes"
                  disabled={this.state.loading}
                  checked={this.state.stream.dis === "yes"}
                  onChange={this.valueChange}/>
              </label>

              <label htmlFor="stream-discoverable-no" disabled={this.state.loading}>No
                <input
                  type="radio"
                  name="dis"
                  value="no"
                  id="stream-discoverable-no"
                  disabled={this.state.loading}
                  checked={this.state.stream.dis === "no"}
                  onChange={this.valueChange}/>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" onClick={this.createStream}>Create →</button>
          </div>
        </div>
      </div>
    )
  }
}
