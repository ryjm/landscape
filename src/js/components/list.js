import React, { Component } from 'react';
import { calculateStations, isDMStation, getStationDetails } from '/lib/util';

export class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  buildDMSection(dmStations) {
    dmStations.map((stationDetails) => {
      return (
        <div key={stationDetails.station} className="mt-3">
          <div className="text-mono"><a href={stationDetails.stationUrl}>
            <u className="text-600">{stationDetails.stationTitle}</u>
          </a></div>
        </div>
      );
    });
  }

  buildSection(stations) {
    return stations.map((stationDetails) => {
      return (
        <div key={stationDetails.station} className="mt-3">
          <div className="text-mono"><a href={stationDetails.stationUrl}>
            <u>{stationDetails.host}</u>
            <span className="text-600">  /  </span>
            <u className="text-600">{stationDetails.stationTitle}</u>
          </a></div>
          <div>{stationDetails.config.con.sis.length} Members</div>
        </div>
      );
    });
  }

  render() {
    let inbox = this.props.store.configs[`~${this.props.api.authTokens.ship}/inbox`];
    if (!inbox) return null;

    let stationDetailList = inbox.src
      .map((station) => {
        if (!this.props.store.configs[station]) return null;
        return getStationDetails(station, this.props.store.configs[station], this.props.api.authTokens.ship)
      })
      .filter((station) => station !== null);

    const chatStations = this.buildSection(stationDetailList.filter((d) => d.type === "chat"));
    const textStations = this.buildSection(stationDetailList.filter((d) => d.type === "text"));
    const DMStations = this.buildDMSection(stationDetailList.filter((d) => d.type === "dm"));

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
