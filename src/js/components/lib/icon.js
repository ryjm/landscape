import React, { Component } from 'react';
import { IconInbox } from '/components/lib/icons/icon-inbox';

export class Icon extends Component {
  render() {
    let iconElem = null;

    switch(this.props.type) {
      case "icon-stream-chat":
        iconElem = <div className="icon-stream-chat"></div>;
        break;
      case "icon-stream-dm":
        iconElem = <div className="icon-stream-dm"></div>;
        break;
      case "icon-collection-index":
        iconElem = <div className="icon-collection"></div>;
        break;
      case "icon-collection-post":
        iconElem = <div className="icon-collection-post"></div>;
        break;
      case "icon-collection-comment":
        iconElem = <div className="icon-collection icon-collection-comment"></div>;
        break;
      case "icon-inbox":
        iconElem = <IconInbox/>
        break;
      case "icon-comment":
        break;
      case "icon-lus":
        break;
      case "icon-panini":
        break;
      case "icon-cross":
        break;
      case "icon-sig":
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

    return (
      <div className="icon-label">
        {iconElem}
      </div>
    )
  }
}
