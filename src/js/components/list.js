import React, { Component } from 'react';
import { calculateStations } from '../util';
import { isDMStation } from '../util';

export class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  buildHeader() {
    let numString = calculateStations(this.props.store.configs);

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
      let expandedStationName = item.key.split("/");

      return (
        <div key={item.key} className="mt-3">
          <div className="text-mono"><a href={`/~~/pages/nutalk/stream?station=${item.key}`}>
            <u>{expandedStationName[0]}</u>
            <span className="text-600">  /  </span>
            <u className="text-600">{expandedStationName[1]}</u>
          </a></div>
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
          <div className="text-mono text-600"><a href={`/~~/pages/nutalk/stream?station=${item.key}`}><u>{title}</u></a></div>
        </div>
      );
    });
  }

  buildTextStations() {
    return Object.arrayify(this.props.store.configs).filter((item) => item.key.includes("collection")).map((item) => {
      let expandedStationName = [`${item.key.split("/")[0]}`, `${item.value.cap}`];

      // go from "~tappyl-dabwex/collection_~~2018.4.19..22.58.12..4c19"
      // to      "~2018.4.19..22.58.12..4c19"
      let targetPath = item.key.split("/")[1].substr(12);

      return (
        <div key={item.key} className="mt-3">
          <div className="text-mono"><a href={`/~~/collections/${targetPath}`}>
            <u>{expandedStationName[0]}</u>
            <span className="text-600">  /  </span>
            <u className="text-600">{expandedStationName[1]}</u>
          </a></div>
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
      <div className="container">
        <div className="row">
          <div className="list-page col-sm-10 col-sm-offset-2">
            <div className="mt-9">
              <div className="text-700">Chats</div>
              {chatStations}
            </div>
            <div className="mt-9">
              <div className="text-700">Blogs, Forum and Notes</div>
              {textStations}
            </div>
            <div className="mt-9">
              <div className="text-700">Direct Messages</div>
              {DMStations}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
