import React, { Component } from 'react';
import { isDMStation } from '../util';

export class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  buildHeader() {
    let numSubs = Object.keys(this.props.store.configs).filter((sta) => !isDMStation(sta) && !sta.includes("inbox")).length;
    let numDMs = Object.keys(this.props.store.configs).filter((sta) => isDMStation(sta)).length;

    let numString = [];
    if (numSubs) numString.push(`${numSubs} subscriptions`);
    if (numDMs) numString.push(`${numDMs} DMs`);

    numString = numString.join(", ");

    return (
      <div>
        <b>List —</b>
        <span className="ml-4">{numString}</span>
      </div>
    );
  }

  componentDidUpdate() {
    let header = this.buildHeader();
    this.props.setHeader(header);
  }

  buildChatStations() {
    return Object.arrayify(this.props.store.configs).filter((item) => item.value.cap === "chat").map((item) => {
      let expandedStationName = item.key.split("/").join("  /  ");

      return (
        <div key={item.key} className="mt-3">
          <div className="text-mono text-600"><a href={`/~~/pages/nutalk/stream?station=${item.key}`}>{expandedStationName}</a></div>
          <div>{item.value.con.sis.length} Members</div>
        </div>
      );
    });
  }

  buildDMStations() {
    return Object.arrayify(this.props.store.configs).filter((item) => isDMStation(item.key)).map((item) => {
      let title = item.value.con.sis
        .filter((mem) => mem !== this.props.api.authTokens.ship)
        .map((mem) => `~${mem}`)
        .join(", ");

      return (
        <div key={item.key} className="mt-3">
          <div className="text-mono text-600"><a href={`/~~/pages/nutalk/stream?station=${item.key}`}>{title}</a></div>
        </div>
      );
    });
  }

  buildTextStations() {
    return Object.arrayify(this.props.store.configs).filter((item) => item.key.includes("collection")).map((item) => {
      let expandedStationName = `${item.key.split("/")[0]}  /  ${item.value.cap}`;

      // go from "~tappyl-dabwex/collection_~~2018.4.19..22.58.12..4c19"
      // to      "~2018.4.19..22.58.12..4c19"
      let targetPath = item.key.split("/")[1].substr(12);

      return (
        <div key={item.key} className="mt-3">
          <div className="text-mono text-600"><a href={`/~~/collections/${targetPath}`}>{expandedStationName}</a></div>
          <div>{item.value.con.sis.length} Members</div>
        </div>
      );
    });
  }

  render() {
    const chatStations = this.buildChatStations();
    const textStations = this.buildTextStations();
    const DMStations = this.buildDMStations();

    return (
      <div>
        <div className="mt-9">
          <div className="text-700">Chat</div>
          {chatStations}
        </div>
        <div className="mt-9">
          <div className="text-700">Text</div>
          {textStations}
        </div>
        <div className="mt-9">
          <div className="text-700">DM</div>
          {DMStations}
        </div>
      </div>
    );
  }
}
