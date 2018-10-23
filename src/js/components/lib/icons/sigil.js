import React, { Component } from 'react';
import { sealDict } from '/components/lib/seal-dict';

export class Sigil extends Component {
  render() {
    let suffix = this.props.suffix ? JSON.parse(this.props.suffix) : false;

    return (
      sealDict.getSeal(this.props.ship.substr(1), this.props.size, suffix)
    )
  }
}
