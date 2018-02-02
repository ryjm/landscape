import React, { Component } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { util } from '../util';

export class StreamPageHeader extends Component {
  render() {
    return (
      <div className="header-subpage">
        <h3 className="header-sep">/</h3>
        <h3 className="inline text-mono">{this.props.queryParams.station}</h3>
        <a className="header-settings text-sm" href={`/~~/pages/nutalk/stream/edit?station=${this.props.queryParams.station}`}>Settings →</a>
      </div>
    )
  }
}

export class StreamPage extends Component {
  constructor(props) {
    super(props);

    this.presence = false;

    this.state = {
      message: "",
      messageSending: false
    };

    this.inputChange = this.inputChange.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
  }

  inputChange(event) {
    this.setState({message: event.target.value});
  }

  uuid() {
    let str = "0v"
    str += Math.ceil(Math.random()*8)+"."
    for (var i = 0; i < 5; i++) {
      let _str = Math.ceil(Math.random()*10000000).toString(32);
      _str = ("00000"+_str).substr(-5,5);
      str += _str+".";
    }

    return str.slice(0,-1);
  }

  submitMessage(event) {
    event.preventDefault();
    event.stopPropagation();

    let message = {
      uid: this.uuid(),
      aud: [this.props.queryParams.station],
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
    console.log('configs = ', this.props.store.configs[station])
    let cos = this.props.store.configs[station] || {pes: {}, con: {sis: []}};
    let statusCir = "";

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
        <h4 className="mt-8">Invited:</h4>
        {invMems}
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
            <form onSubmit={this.submitMessage}>
              <input className="chat-input-field" type="text" placeholder="Say something" value={this.state.message} onChange={this.inputChange}/>
            </form>
          </div>
        </div>
        <ul className="nav-main">
          <li>
            <a href="javascript:void(0)">12 members</a>
          </li>
          <li>
            <a href="javascript:void(0)">3 pending invites </a>
          </li>
          <li>
            <a href="javascript:void(0)">invite +</a>
          </li>
        </ul>
        <div className="chat-members">
          {chatMembers}
        </div>
      </div>
    )
  }
}
