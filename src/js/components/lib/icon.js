import React, { Component } from 'react';

export class Icon extends Component {
  render() {
    switch(this.props.type) {
      case "icon-stream-chat":
        return <div className="icon-stream-chat"></div>
        break;
      case "icon-stream-dm":
        break;
      case "icon-collection-index":
        break;
      case "icon-collection-post":
        break;
      case "icon-inbox":
        break;
      case "icon-comment":
        break;
      case "icon-lus":
        break;
      case "icon-panini":
        break;
      case "icon-cross":
        break;
      // case "chat":
      //   return <div className="icon icon-item icon-chat"></div>;
      //   break;
      // case "dm":
      //   return <div className="icon icon-item icon-dm"></div>;
      //   break;
      // case "inbox":
      //   return <div className="icon icon-item icon-inbox"></div>;
      //   break;
      // case "collection-index":
      //   return <div className="icon icon-item icon-text"></div>;
      //   break;
      // case "collection-post":
      //   return <div className="icon icon-item icon-text"><div className="icon-text-topic"></div></div>;
      //   break;
      // default:
      //   return null;
    }
  }
}
