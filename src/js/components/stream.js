import React, { Component } from 'react';
import { ChatPage } from './stream/chat';
import { FeedPage } from './stream/feed';

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
  }

  render() {
    let cos = this.props.store.configs[this.props.queryParams.station];
    let subpage = null;

    if (cos && (cos.cap === "chat" || cos.cap === "dm")) {
      subpage = [(<ChatPage {...this.props} />)];
    } else if (cos && cos.cap === "feed") {
      subpage = [(<FeedPage {...this.props} />)];
    }

    return (
      <div>
        {subpage}
      </div>
    )
  }
}
