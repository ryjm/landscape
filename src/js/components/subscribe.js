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
          sub: !(this.props.circle in this.props.store.configs),
          //what is this name?
          nom: 'inbox',
          srs: [this.props.circle]
        }
      }
    )
  }

  render() {
    return (
      <div className="subscribe">
        <button
          className={this.props.circle in this.props.store.configs ? "btn btn-tetiary" : "btn btn-primary"}
          onClick={this.subscribe}
          >
          {this.props.circle in this.props.store.configs ? "Unsubscribe ×" : "Subscribe →"}
        </button>
      </div>
    )
  }
}
