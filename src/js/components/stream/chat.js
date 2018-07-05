import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { Message } from '/components/lib/message';
import { prettyShip, isUrl, uuid, getMessageContent, isDMStation } from '/lib/util';
import { createDMStation } from '/services';
import classNames from 'classnames';

export class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.presence = false;

    // // TODO: This is bad. Issue is that queryParams aren't being loaded properly
    let station = props.queryParams.station || "~zod/null";

    let circle = station.split("/")[1];
    let host = station.split("/")[0].substr(1);

    this.state = {
      station,
      circle,
      host,
      message: "",
      invitee: "",
      numMessages: 0,
      scrollLocked: true,
      pendingMessages: [],
      dmStationCreated: false
    };

    this.messageChange = this.messageChange.bind(this);
    this.messageSubmit = this.messageSubmit.bind(this);

    this.inviteChange = this.inviteChange.bind(this);
    this.inviteSubmit = this.inviteSubmit.bind(this);

    this.onScrollStop = this.onScrollStop.bind(this);

    this.scrollbarRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    let messages = props.store.messages.stations[state.station] || [];
    let clearIndexes = [];

    messages.forEach(msg => {
      state.pendingMessages.forEach((pend, i) => {
        if (msg.uid === pend.uid) {
          clearIndexes.push(i);
        }
      })
    });

    _.pullAt(state.pendingMessages, clearIndexes);

    return {
      ...state,
      pendingMessages: state.pendingMessages
    }
  }

  componentDidMount() {
    let path = `/circle/${this.state.circle}/config-l/grams/-20`;

    this.props.api.bind(path, "PUT", this.state.host);

    this.scrollIfLocked();
  }

  componentWillUnmount() {
    let path = `/circle/${this.state.circle}/config-l/grams/-20`;

    this.props.api.bind(path, "DELETE", this.state.host);
  }

  componentDidUpdate(prevProps, prevState) {
    this.createDMStationIfNeeded();
    this.updateNumMessagesLoaded(prevProps, prevState);
  }

  createDMStationIfNeeded() {
    if (this.props.store.dms.stored === true &&
        isDMStation(this.state.station) &&
        !this.props.store.dms.stations.includes(this.state.station.split("/")[1]) &&
        !this.state.dmStationCreated)
    {
      createDMStation(this.state.station, false);

      this.setState({
        dmStationCreated: true
      });
    }
  }

  updateNumMessagesLoaded(prevProps, prevState) {
    let station = prevProps.store.messages.stations[this.state.station] || [];
    let numMessages = station.length;

    if (numMessages > prevState.numMessages && this.scrollbarRef.current) {
      this.setState({
        numMessages: numMessages
      });
    }

    this.scrollIfLocked();
  }

  scrollIfLocked() {
    if (this.state.scrollLocked && this.scrollbarRef.current) {
      this.scrollbarRef.current.scrollToBottom();
    }
  }

  requestChatBatch() {
    let newNumMessages = this.state.numMessages + 50;

    let path = `/circle/${this.state.circle}/grams/-${newNumMessages}/-${this.state.numMessages}`;

    this.props.api.bind(path, "PUT", this.state.host);
  }

  onScrollStop() {
    let scroll = this.scrollbarRef.current.getValues();

    this.setState({
      scrollLocked: (scroll.top === 1)
    });

    if (scroll.top === 0) {
      this.requestChatBatch();
    }
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

    let aud, sep;
    let wen = Date.now();
    let uid = uuid();
    let aut = this.props.api.authTokens.ship;

    let config = this.props.store.configs[this.state.station];

    if (isDMStation(this.state.station)) {
      aud = this.state.station
        .split("/")[1]
        .split(".")
        .map((mem) => `~${mem}/${this.state.circle}`);

    } else {
      aud = [this.state.station];
    }

    if (isUrl(this.state.message)) {
      sep = {
        url: this.state.message
      }
    } else {
      sep = {
        lin: {
          msg: this.state.message,
          pat: false
        }
      }
    }

    let message = {
      uid,
      aut,
      wen,
      aud,
      sep,
    };

    this.props.api.hall({
      convey: [message]
    });

    this.setState({
      message: "",
      pendingMessages: this.state.pendingMessages.concat({...message, pending: true})
    });
  }

  inviteSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.api.permit(this.state.circle, [this.state.invitee], true);

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
          <span className="chat-member-name"><a className="shipname" href={prettyShip(ship)[1]}>{prettyShip(ship)[0]}</a></span>
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

  buildMessage(msg) {
    let details = getMessageContent(msg);
    let autLabel = msg.printship ? prettyShip(`~${msg.aut}`)[0] : null;
    let appClass = classNames({
      'row': true,
      'chat-msg-app': msg.app,
      'chat-msg-pending': msg.pending
    });

    if (msg.date) {
      return (
        <div className="chat-sep" key={msg.date}>{msg.date}</div>
      )
    } else {
      return (
        <div key={msg.uid} className={appClass}>
          <div className="col-sm-2 text-mono"><a className="shipname" href={prettyShip(msg.aut)[1]}>{autLabel}</a></div>
          <div className="col-sm-8"><Message details={details}></Message></div>
        </div>
      )
    }
  }

  addPendingMessages(messages) {
    let msgs = [...messages];

    if (this.state.pendingMessages.length > 0) {
      this.state.pendingMessages.forEach(pMsg => {
        let lastIndex = msgs.length - 1;
        let printship = lastIndex === -1 ? true : msgs[lastIndex] !== this.state.pendingMessages.aut;
        msgs.push({...pMsg, printship});
      })
    }

    return msgs;
  }

  render() {
    // TODO: This is bad. Issue is that props aren't being loaded properly
    if (this.state.station === "~zod/null") return null;

    let messages = this.props.store.messages.stations[this.state.station] || [];
    messages = this.addPendingMessages(messages);

    this.setPresence(this.state.station);

    let chatRows = this.assembleChatRows(messages);
    let chatMembers = this.assembleMembers(this.state.station);
    let chatMessages = chatRows.map(this.buildMessage);

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-10 col-sm-offset-2">
            <Scrollbars
              ref={this.scrollbarRef}
              renderTrackHorizontal={props => <div style={{display: "none"}}/>}
              style={{height: 650}}
              onScrollStop={this.onScrollStop}
              renderView={props => <div {...props} className="chat-scrollpane-view"/>}
              autoHide
              className="chat-scrollpane">
              {chatMessages}
            </Scrollbars>
            <div className="chat-input row mt-6">
              <div className="col-sm-2 text-700">
                {prettyShip(`~${this.props.api.authTokens.ship}`)[0]}
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
        </div>
      </div>
    )
  }
}
