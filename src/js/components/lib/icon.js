import React, { Component } from 'react';

export class Icon extends Component {
  render() {
    switch(this.props.type) {
      case "chat":
        return <div className="icon icon-item icon-chat"></div>;
        break;
      case "dm":
        return <div className="icon icon-item icon-dm"></div>;
        break;
      case "inbox":
        return <div className="icon icon-item icon-inbox"></div>;
        break;
      case "collection-index":
        return <div className="icon icon-item icon-text"></div>;
        break;
      case "collection-post":
        return <div className="icon icon-item icon-text"><div className="icon-text-topic"></div></div>;
        break;
      default:
        return null;
    }
  }
}
