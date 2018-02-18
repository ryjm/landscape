import React, { Component } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { util } from '../../util';

export class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.presence = false;

    this.state = {
      message: "",
      invitee: ""
    };

    this.messageChange = this.messageChange.bind(this);
    this.messageSubmit = this.messageSubmit.bind(this);

    this.inviteChange = this.inviteChange.bind(this);
    this.inviteSubmit = this.inviteSubmit.bind(this);
  }

  messageChange(event) {
    this.setState({message: event.target.value});
  }

  inviteChange(event) {
    this.setState({invitee: event.target.value});
  }

  messageSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    let aud;
    let config = this.props.store.configs[this.props.queryParams.station];

    if (config.cap === "dm") {
      // TODO: Actually, ships should = config.con.sis instead of getting it from name
      // but config.con.sis isn't filled because we don't formally invite host ships in case of mirroring
      // need to add to config.con.sis without sending invites
      let ships = this.props.queryParams.station.split("/").slice(1)[0].split(".");
      aud = ships.sort().map((mem) => {
        // EG,  ~polzod/marzod.polzod.zod
        console.log('mem = ', mem);
        return `~${mem}/${ships.join('.')}`;
      })
    } else {
      aud = [this.props.queryParams.station];
    }

    let message = {
      uid: util.uuid(),
      aud: aud,
      aut: this.props.store.usership,
      wen: Date.now(),
      sep: {
        lin: {
          msg: this.state.message,
          pat: false
        }
      }
    };

    this.props.api.hall({
      convey: [message]
    });

    this.setState({
      message: ""
    });
  }

  inviteSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.api.hall({
      permit: {
        nom: this.props.queryParams.station.split("/")[1],
        sis: [this.state.invitee],
        inv: true
      }
    });

    this.setState({
      invitee: ""
    });
  }

  assembleChatRows(messages) {
    let chatRows = [];
    let prevDay = 0;
    let prevName = "";

    // add date markers & group messages by author
    for (var i = 0; i < messages.length; i++) {
      let date = moment(messages[i].wen);
      if (messages[i].wen > prevDay) {
        chatRows.push({
          date: date.format("dddd, MMM Do")
        });

        prevDay = date.endOf('day').format('x');
        prevName = "";
      }

      if (prevName !== messages[i].aut) {
        messages[i].printship = true;
        prevName = messages[i].aut;
      }

      chatRows.push(messages[i]);
    }

    return chatRows;
  }

  assembleMembers(station) {
    let cos = this.props.store.configs[station] || {pes: {}, con: {sis: []}};
    let statusCir = "";

    if (!cos.pes) {
      return;
    }

    let presMems = Object.keys(cos.pes).map(ship => {
      switch (cos.pes[ship].pec) {
        case "idle":
          statusCir = "cir-green"
          break;
        case "talk":
          statusCir = "cir-red"
          break;
        case "gone":
          statusCir = "cir-black"
          break;
      }

      return (
        <div key={ship}>
          <span className={`cir-status mr-4 ${statusCir}`}></span>
          <span className="chat-member-name">{ship}</span>
        </div>
      )
    });

    let invMems = cos.con.sis.map(inv => {
      // If user is in whitelist but not in presence list
      if (Object.keys(cos.pes).indexOf(`~${inv}`) === -1) {
        return (
          <div key={`${inv}`}>
            <span className={`cir-status mr-4 cir-grey`}></span>
            <span className="chat-member-name">{`~${inv}`}</span>
          </div>
        )
      }
    });

    return (
      <div>
        {presMems}
        <h5 className="mt-8">Invited:</h5>
        {invMems}
        <form onSubmit={this.inviteSubmit}>
          <input type="text" className="w-30 input-sm"
            value={this.state.invitee}
            onChange={this.inviteChange}
            placeholder="Ship..." />
        </form>
      </div>
    )
  }

  setPresence(station) {
    if (!this.presence) {
      this.presence = true;

      this.props.api.hall({
        notify: {
          aud: [station],
          pes: "idle"
        }
      });
    }
  }

  render() {
    let stationName = this.props.queryParams.station;
    let station = this.props.store.messages[stationName] || {messages: []};

    this.setPresence(stationName);

    let chatRows = this.assembleChatRows(station.messages);
    let chatMembers = this.assembleMembers(stationName);

    let chatMessages = chatRows.map((msg) => {
      let autLabel = msg.printship ? `~${msg.aut}` : null;
      let appClass = msg.app ? " chat-msg-app" : "";

      if (msg.date) {
        return (
          <div className="chat-sep" key={msg.date}>{msg.date}</div>
        )
      } else {
        return (
          <div key={msg.uid} className={`row ${appClass}`}>
            <div className="col-sm-2 text-mono">{autLabel}</div>
            <div className="col-sm-8">{msg.sep.lin.msg}</div>
          </div>
        );
      }
    });

    return (
      <div>
        <Scrollbars
          renderTrackHorizontal={props => <div style={{display: "none"}}/>}
          style={{height: 650}}
          autoHide
          className="chat-scrollpane">
          {chatMessages}
        </Scrollbars>
        <div className="chat-input row mt-6">
          <div className="col-sm-2 text-700">
            ~{this.props.store.usership}
          </div>
          <div className="col-sm-8">
            <form onSubmit={this.messageSubmit}>
              <input className="chat-input-field" type="text" placeholder="Say something" value={this.state.message} onChange={this.messageChange}/>
            </form>
          </div>
        </div>
        <div className="sidebar">
          {chatMembers}
        </div>
      </div>
    )
  }
}
