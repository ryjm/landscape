import React, { Component } from 'react';

export class CollectionCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      invites: [],
      visible: false,
    };
  }

  render() {
    return (
      <h5>Disabled screen</h5>
    )
  }
}
