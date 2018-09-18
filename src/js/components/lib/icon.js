import React, { Component } from 'react';
import { IconInbox } from '/components/lib/icons/icon-inbox';
import { IconComment } from '/components/lib/icons/icon-comment';
import { IconSig } from '/components/lib/icons/icon-sig';

export class Icon extends Component {
  render() {
    let iconElem = null;

    switch(this.props.type) {
      case "icon-stream-chat":
        iconElem = <span className="icon-stream-chat"></span>;
        break;
      case "icon-stream-dm":
        iconElem = <span className="icon-stream-dm"></span>;
        break;
      case "icon-collection-index":
        iconElem = <span className="icon-collection"></span>;
        break;
      case "icon-collection-post":
        iconElem = <span className="icon-collection-post"></span>;
        break;
      case "icon-collection-comment":
        iconElem = <span className="icon-collection icon-collection-comment"></span>;
        break;
      case "icon-panini":
        iconElem = <span className="icon-panini"></span>
        break;
      case "icon-x":
        iconElem = <span className="icon-x"></span>
        break;
      case "icon-lus":
        iconElem = <span className="icon-lus"></span>
        break;
      case "icon-inbox":
        iconElem = <IconInbox />
        break;
      case "icon-comment":
        iconElem = <IconComment />
        break;
      case "icon-sig":
        iconElem = <IconSig />
        break;
    }

    let className = this.props.iconLabel ? "icon-label" : "";

    return (
      <span className={className}>
        {iconElem}
      </span>
    )
  }
}
