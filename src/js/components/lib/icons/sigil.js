import React, { Component } from 'react';
import { sealDict } from '/components/lib/seal-dict';

export class Sigil extends Component {

  render() {
    return (
      sealDict.getSeal(this.props.ship.substr(1), this.props.size)
    )
  }
}
