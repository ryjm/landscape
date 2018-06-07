import React, { Component } from 'react';

export class ChatList extends Component {
  componentDidMount() {
    let path = `/public`;

    this.props.api.bind(path, "PUT", this.props.hostship);
  }

  componentWillUnmount() {
    let path = `/public`;

    this.props.api.bind(path, "DELETE", this.props.hostship);
  }

  render() {
    return (
      <ul>
        <div className="mt-2 text-500">
          <a href="#">/what-is-this</a>
        </div>
      </ul>
    );
  }
}
