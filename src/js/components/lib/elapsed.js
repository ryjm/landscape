import React, { Component } from 'react';
import { secToString } from '/lib/util';
// display elapsed time by converting galactic time to client time

export class Elapsed extends Component {
  constructor(props) {
    super(props);
    // console.log('elapsed props...', props);
  }

  renderTime() {
    const serverTime = new Date(this.props.timestring);
    const clientTime = new Date(); // local
    return secToString((clientTime - serverTime) / 1000).split(' ')[0];
  }

  render() {
    return (
      <span className={this.props.classes}>-{this.renderTime()}</span>
    )
  }
}
