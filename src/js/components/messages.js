import React, { Component } from 'react';

export class MessagesPage extends Component {
  render() {
    var messageElems = this.props.messages.map((msg) => {
      return (
        <li>
          <b>{msg.author}: </b>
          <span>{msg.body}</span>
        </li>
      );
    })

    return (
      <ul>
        {messageElems}
      </ul>
    );
  }
}
