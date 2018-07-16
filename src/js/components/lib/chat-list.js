import React, { Component } from 'react';
import { isDMStation, getStationDetails } from '/lib/util';

export class ChatList extends Component {
  componentDidMount() {
    let path = `/public`;

    this.props.api.bind(path, "PUT", this.props.hostship.slice(1));
  }

  componentWillUnmount() {
    let path = `/public`;

    this.props.api.bind(path, "DELETE", this.props.hostship.slice(1));
  }
  renderText() {
    if (this.props.store.public[this.props.hostship]) {
      const text = this.props.store.public[this.props.hostship].map((cir) => {
        const deets = getStationDetails(cir, this.props.store.configs[cir], this.props.api.authTokens.ship)
        if (deets.type == "text") {
          return (
            <div className="mt-2 text-500">
              <a href={deets.stationUrl}>~{deets.host} / {deets.stationTitle}</a>
            </div>
          )
        } else if (deets.type == "text-topic") {
          return null;
        }
      });
      return text;
    } else {
      return null;
    }
  }

  renderChats() {
    if (this.props.store.public[this.props.hostship]) {
      const chats = this.props.store.public[this.props.hostship].map((cir) => {
        const deets = getStationDetails(cir, this.props.store.configs[cir], this.props.api.authTokens.ship)
        if (deets.type == "chat") {
          return (
            <div className="mt-2 text-500">
              <a href={`/~~/pages/nutalk/stream?station=${cir}`}>{cir}</a>
            </div>
          )
        } else {
          return null;
        }
      });
      return chats;
    } else {
      return null;
    }
  }

  render() {
    const chats = this.renderChats();
    const text = this.renderText();
    return (
      <div>
        <div className="text-700 mt-8">Blogs, Fora and Notes</div>
        {text}
        <div className="text-700 mt-8">Chats</div>
        {chats}
      </div>
    );
  }
}
