import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { Message } from '/components/lib/message';
import { prettyShip, isUrl, uuid, getMessageContent, isDMStation } from '/lib/util';
import { createDMStation } from '/services';
import { sealDict } from '/components/lib/seal-dict';
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
      placeholder: `Send a message to /${circle}`,
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
      pendingMessages: state.pendingMessages,
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

    // group messages by author
    for (var i = 0; i < messages.length; i++) {
      if (prevName !== messages[i].aut) {
        chatRows.push({
          printship: true,
          aut: messages[i].aut,
          wen: messages[i].wen
        });

        prevName = messages[i].aut;
      }

      chatRows.push(messages[i]);
    }

    return chatRows;
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
    let appClass = classNames({
      'flex': true,
      'align-center': true,
      'chat-msg-app': msg.app,
      'chat-msg-pending': msg.pending,
      'mt-6': msg.printship
    });

    return (
      <div key={msg.uid} className={appClass}>
        <div className="flex-1st"></div>
        <div className="flex-2nd">
          {msg.printship &&
            <a className="vanilla" href={prettyShip(msg.aut)[1]}>
              {sealDict.getSeal(msg.aut, 18)}
            </a>
          }
        </div>
        <div className="flex-3rd">
          {msg.printship &&
            <a className="vanilla text-700 text-mono" href={prettyShip(msg.aut)[1]}>{prettyShip(`~${msg.aut}`)[0]}</a>
          }

          {!msg.printship &&
            <Message details={details}></Message>
          }
        </div>
      </div>
    )
  }

  render() {
    // TODO: This is bad. Issue is that props aren't being loaded properly
    if (this.state.station === "~zod/null") return null;

    let messages = this.props.store.messages.stations[this.state.station] || [];
    messages = [...messages, ...this.state.pendingMessages];

    this.setPresence(this.state.station);

    let chatRows = this.assembleChatRows(messages);
    let chatMessages = chatRows.map(this.buildMessage);

    return (
      <div className="container">
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
        <div className="flex align-center mt-6">
          <div className="flex-1st"></div>
          <div className="flex-3rd">
            <form onSubmit={this.messageSubmit}>
              <input className="chat-input-field"
                     type="text"
                     placeholder={this.state.placeholder}
                     value={this.state.message}
                     onChange={this.messageChange} />
            </form>
          </div>
          <a onClick={this.messageSubmit} className="text-700">Send</a>
        </div>
      </div>
    )
  }
}
