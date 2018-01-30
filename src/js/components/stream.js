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

    this.props.api.sendHallAction({
      convey: [message]
    });

    this.setState({
      message: ""
    });
  }

  render() {
    let station = this.props.store.messages[this.props.queryParams.station] || {messages: []};

    let chatRows = [];
    let prevDay = 0;
    let thing = moment();
    let prevName = "";

    // add date markers & group messages by author
    for (var i = 0; i < station.messages.length; i++) {
      let date = moment(station.messages[i].wen);
      if (station.messages[i].wen > prevDay) {
        chatRows.push({
          date: date.format("dddd, MMM Do")
        });

        prevDay = date.endOf('day').format('x');
        prevName = "";
      }

      if (prevName !== station.messages[i].aut) {
        station.messages[i].printship = true;
        prevName = station.messages[i].aut;
      }

      chatRows.push(station.messages[i]);
    }

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
      <div className="container">
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
      </div>
    )
  }
}
