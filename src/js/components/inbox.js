import React, { Component } from 'react';
import { InboxRecentPage } from '/components/inbox/recent';
import { InboxListPage } from '/components/inbox/list';
import classnames from 'classnames';

export class InboxPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "recent"
    }
  }

  render() {
    let content;

    if (this.state.view === "recent") {
      content = <InboxRecentPage {...this.props} />;
    } else if (this.state.view === "all") {
      content = <InboxListPage {...this.props} />;
    }

    let recentClass = classnames({
      'vanilla': true,
      'mr-8': true,
      'inbox-link': true,
      'inbox-link-active': this.state.view === "recent",
    });

    let allClass = classnames({
      'vanilla': true,
      'inbox-link': true,
      'inbox-link-active': this.state.view === "all",
    });

    return (
      <div className="inbox-page container">
        <div className="flex">
          <div className="flex-1st"></div>
          <div className="flex-2nd"></div>
          <div className="flex-3rd">
            <a className={recentClass} onClick={() => { this.setState({view: "recent"}) }}>Recent</a>
            <a className={allClass} onClick={() => { this.setState({view: "all"}) }}>All</a>
          </div>
        </div>
        {content}
      </div>
    );
  }
}
