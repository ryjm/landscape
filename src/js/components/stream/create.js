import React, { Component } from 'react';
import { arrayEqual } from '../../util';

export class StreamCreatePage extends Component {
  constructor(props) {
    super(props);

    console.log('stage 1 : instantiating');

    this.state = {
      loading: false,
      stream: {
        nom: "",
        des: "chat",
        sec: "village",
        dis: "no",
        aud: [],
        audNew: ""
      },
      oldStream: {},
      descriptions: {
        type: {
          "feed": "A feed is a time-ordered (newest-first) list of microblogging messages.",
          "chat": "A chat is a time-ordered (newest-last) traditional, multi-user chatroom.",
          "list": "A list is a compiled aggregation of other circles.",
          "dm": "A DM is a direct message group between one or more recipients."
        },
        security: {
          channel: "A channel is publicly readable and writable, with a blacklist for blocking.",
          village: "A village is privately readable and writable, with a whitelist for inviting.",
          journal: "A journal is publicly readable and privately writable, with a whitelist for authors.",
          mailbox: "A mailbox is owner-readable and publicly writable, with a blacklist for blocking."
        }
      },
      deleteStream: "",
      editLoaded: false
    };

    this.submitStream = this.submitStream.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.addAud = this.addAud.bind(this);
    this.remAud = this.remAud.bind(this);

    this.deleteStream = this.deleteStream.bind(this);
    this.deleteChange = this.deleteChange.bind(this);
  }

  componentWillUpdate() {
    console.log('stage 2 : updating');
  }

  componentWillUnmount() {
    console.log('stage 3 : unloading');
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.editLoaded) return;

    let newAud = nextProps.store.configs[`~${this.props.store.usership}/${this.state.stream.nom}`].con.sis;

    if (!arrayEqual(this.state.stream.aud, newAud)) {
      this.setState({
        stream: Object.assign(this.state.stream, {aud: newAud})
      });
    }
  }

  loadEdit() {
    let editStation = this.props.queryParams.station;
    if (editStation && this.props.store.configs[editStation] && !this.state.editLoaded) {
      let station = this.props.store.configs[editStation];
      let stream = {
        nom: editStation.split("/").slice(1).join("/"), // TODO: This will need editing if there are multiple /'s in a station name`
        des: station.cap,
        sec: station.con.sec,
        aud: station.con.sis,
        dis: "no"
      };
      this.setState({
        stream: stream,
        oldStream: Object.assign({}, stream), // For some reason we need to make a shallow copy here... wtf?!?
        editLoaded: true
      });
    }
  }

  deleteChange(event) {
    console.log(event.target.value)
    this.setState({
      deleteStream: event.target.value
    });
  }

  deleteStream() {
    console.log("deleting")

    this.props.api.hall({
      delete: {
        nom: this.state.deleteStream,
        why: "cuz"
      }
    });

    // this.props.api.hall({
    //   source: {
    //     nom: `inbox`,
    //     sub: false,
    //     srs: [this.state.deleteStream]
    //   }
    // });
  }

  submitStream() {
    if (this.state.editLoaded) {
      this.editStream();
    } else {
      this.createStream();
    }
  }

  editStream() {
    if (!this.state.oldStream) return;

    if (this.state.stream.des !== this.state.oldStream.des) {
      this.props.api.hall({
        depict: {
          nom: this.state.oldStream.nom,
          des: this.state.stream.des
        }
      })
    }
  }

  createStream() {
    this.props.api.hall({
      create: {
        nom: this.state.stream.nom,
        des: this.state.stream.des,
        sec: this.state.stream.sec
      }
    }, {
      target: `/~~/pages/nutalk/stream?station=~${this.props.store.usership}/${this.state.stream.nom}`
    });

    this.setState({
      loading: true
    });

    if (this.state.stream.aud.length > 0) {
      this.props.storeData({
        pendingInvites: [{
          aud: this.state.stream.aud,
          nom: this.state.stream.nom
        }]
      });
    }
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

    let des = stream.des || this.state.stream.des;
    let aud = stream.aud || this.state.stream.aud;

    if (des === "dm") {
      stream.sec = "village";
      stream.nom = `${aud.concat(this.props.store.usership).sort().join(".")}`;
    }

    this.setState({
      stream: Object.assign(this.state.stream, stream)
    });
  }

  addAud() {
    let newStream = {};

    if (this.state.editLoaded) {
      let inv = (this.state.stream.sec === "village" ||
                 this.state.stream.sec === "journal");

      this.props.api.hall({
        permit: {
          nom: this.state.stream.nom,
          inv: inv,
          sis: [this.state.stream.audNew]
        }
      });

      newStream = {
        audNew: ""
      }
    } else {
      newStream = {
        aud: this.state.stream.aud.concat(this.state.stream.audNew),
        audNew: ""
      };
    }

    let aud = newStream.aud || this.state.stream.aud;

    if (this.state.stream.des === "dm") {
      newStream.nom = `${aud.concat(this.props.store.usership).sort().join(".")}`;
    }

    this.setState({
      stream: Object.assign(this.state.stream, newStream)
    });
  }

  remAud(evt) {
    let newStream = {};

    if (this.state.editLoaded) {
      this.props.api.hall({
        permit: {
          nom: this.state.stream.nom,
          inv: false,
          sis: [evt.target.dataset.ship]
        }
      })
    } else {
      newStream.aud = this.state.stream.aud.filter(mem => mem !== evt.target.dataset.ship);
    }

    let aud = newStream.aud || this.state.stream.aud;

    if (this.state.stream.des === "dm") {
      newStream.nom = `${aud.concat(this.props.store.usership).sort().join(".")}`;
    }

    this.setState({
      stream: Object.assign(this.state.stream, newStream)
    });
  }

  render() {
    this.loadEdit();

    let typeDesc = this.state.descriptions.type[this.state.stream.des];
    let secDesc = this.state.descriptions.security[this.state.stream.sec];

    let nomDisabled = this.state.loading || this.state.stream.des === "dm";
    let secDisabled = this.state.loading || this.state.stream.des === "dm";

    let audienceLabel = (this.state.stream.sec === "village" ||
                         this.state.stream.sec === "journal") ?
                         "Whitelist" : "Blacklist";

    let audienceList = this.state.stream.aud.map(mem => {
      if (mem === this.props.store.usership) return null;

      return (
        <div className="row space-between">
          <div className="col-sm-8">{`~${mem}`}</div>
          <div className="col-sm-offset-3 col-sm-1 minus" data-ship={mem} onClick={this.remAud}>-</div>
        </div>
      )
    });

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="create-stream-page">
            <div className="input-group mb-9">
              <label htmlFor="nom">Name</label>
              <input
                type="text"
                className="input-text-lg"
                name="nom"
                placeholder="Secret club"
                disabled={nomDisabled}
                onChange={this.valueChange}
                value={this.state.stream.nom}/>
            </div>

            <div className="input-group mb-9">
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
                      <option value="dm">DM</option>
                    </select>
                    <span className="select-icon">↓</span>
                  </div>
                </div>
                <div className="col-sm-offset-1 col-sm-5">
                  <i>{typeDesc}</i>
                </div>
              </div>
            </div>

            <div className="input-group mb-9">
              <label htmlFor="stream-security">Security model</label>
              <div className="row">
                <div className="col-sm-6">
                  <div className="select-dropdown" disabled={secDisabled}>
                    <select
                      name="sec"
                      disabled={secDisabled}
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
                  <i>{secDesc}</i>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="input-group mb-9">
                  <label htmlFor="stream-ships">{audienceLabel}</label>

                  {audienceList}
                  <div className="text-700 mt-8">Add New</div>
                  <div className="row">
                    <input
                      type="text"
                      name="audNew"
                      className="col-sm-8"
                      placeholder="ramvel-rodpyl"
                      disabled={this.state.loading}
                      value={this.state.stream.audNew}
                      onChange={this.valueChange} />

                    <span className="col-sm-offset-3 col-sm-1 plus" onClick={this.addAud}>+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-group input-group-radio mb-9">
              <div className="text-700 mt-4">Discoverable?</div>

              <label htmlFor="stream-discoverable-yes"
                     disabled={this.state.loading}
                     className={this.state.stream.dis === "yes" ? "radio-active" : ""}> Yes
                <input
                  type="radio"
                  name="dis"
                  value="yes"
                  id="stream-discoverable-yes"
                  disabled={this.state.loading}
                  checked={this.state.stream.dis === "yes"}
                  onChange={this.valueChange}/>
              </label>

              <label htmlFor="stream-discoverable-no"
                     disabled={this.state.loading}
                     className={this.state.stream.dis === "no" ? "radio-active" : ""}> No
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

            <button type="submit" className="btn btn-primary mt-12" onClick={this.submitStream}>{this.state.editLoaded ? "Submit" : "Create"} →</button>
          </div>
        </div>
        <div className="sidebar fawef">
          <input type="text" onChange={this.deleteChange} />
          <button type="button" onClick={this.deleteStream}>Delete</button>
        </div>
      </div>
    )
  }
}
