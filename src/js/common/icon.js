import React, { Component } from 'react';

export class Icon extends Component {
  render() {
    switch(this.props.type) {
      case "chat":
        return <div className="icon icon-chat"></div>;
        break;
      case "dm":
        return <div className="icon icon-dm"></div>;
        break;
      case "inbox":
        return <div className="icon icon-inbox"></div>;
        break;
      case "text":
        return <div className="icon icon-text"></div>;
        break;
      case "text-topic":
        return <div className="icon icon-text"><div className="icon-text-topic"></div></div>;
        break;
      default:
        return null;
    }
  }
}
