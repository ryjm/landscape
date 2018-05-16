import React, { Component } from 'react';
//import { util } from '../../util';

export class Subscribe extends Component {
  constructor(props) {
    super(props);

    console.log('un/subscribe from ...', this.props.circle);
    console.log('all props...', props);

    this.subscribe = this.subscribe.bind(this);
  }

  subscribe() {
    this.props.api.hall(
      {
        source: {
          sub: !(this.checkSubscribed()),
          //what is this name?
          nom: 'inbox',
          srs: [this.props.circle]
        }
      }
    )
  }

  checkSubscribed() {
    let inbox = this.props.store.configs[`~${this.props.api.authTokens.user}/inbox`];
    if (!inbox) {
      return false;
    } else if (inbox.src.indexOf(this.props.circle) == -1) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let inbox = this.props.store.configs[`~${this.props.api.authTokens.user}/inbox`];
    return (
      <div className="subscribe">
        <button
          className={this.checkSubscribed() ? "btn btn-tetiary mb-4" : "btn btn-primary mb-4"}
          onClick={this.subscribe}
          >
          {this.checkSubscribed() ? "Unsubscribe ×" : "Subscribe →"}
        </button>
      </div>
    )
  }
}
