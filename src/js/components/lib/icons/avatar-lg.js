import React, { Component } from 'react';
import { sealDict } from '/components/lib/seal-dict';

export class AvatarLg extends Component {
  render() {
    return (
      sealDict.getSeal(this.props.ship.substr(1), 320)
    )
  }
}
