import React, { Component } from 'react';

export class AppHeader extends Component {
  render() {
    let subpage = (this.props.store.header.pageName !== "") ? (
      <div className="header-subpage">
        <h3 className="header-sep">/</h3>
        <h3 className="inline text-mono">{this.props.store.header.pageName}</h3>
        {this.props.store.header.errata}
      </div>
    ) : null;

    return (
      <div className="header-main">
        <a href="/~~/pages/nutalk"><h3 className="header-page">Inbox</h3></a>
        {subpage}
      </div>
    )
   }
}
