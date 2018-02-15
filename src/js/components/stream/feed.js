import React, { Component } from 'react';
import { util } from '../../util';
import moment from 'moment';

export class FeedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    }

    this.messageSubmit = this.messageSubmit.bind(this);
    this.messageChange = this.messageChange.bind(this);
  }

  messageChange(event) {
    this.setState({message: event.target.value});
  }

  messageSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    let message = {
      uid: util.uuid(),
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

  render() {
    let messages = this.props.store.messages[this.props.queryParams.station]
    let messageElems = null;

    if (messages) {
      messageElems = messages.messages
        .slice(0)                         // creates a shallow copy
        .sort((a,b) => (a.wen < b.wen))   // sort messages newest-first
        .map(msg => {
          let displayDate = moment(msg.wen).fromNow();

          return (
            <div key={msg.uid} className="mt-8">
              <div className="text-mono">{displayDate}</div>
              <div className="text-lg">{msg.sep.lin.msg}</div>
            </div>
          )
      });
    }

    return (
      <div>
        <b>~{this.props.store.usership}</b>
        <div className="chat-input mt-6">
          <div className="col-sm-8">
            <form onSubmit={this.messageSubmit}>
              <input className="chat-input-field" type="text" placeholder="Say something" value={this.state.message} onChange={this.messageChange}/>
            </form>
          </div>
        </div>
        <div>
          {messageElems}
        </div>
      </div>
    )
  }
}
