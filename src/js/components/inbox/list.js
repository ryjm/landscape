import React, { Component } from 'react';
import { getSubscribedStations } from '/lib/util';

export class InboxListPage extends Component {
  constructor(props) {
    super(props);
  }

  buildDMSection(dmStations) {
    return dmStations.map((stationDetails) => {
      return (
        <div key={stationDetails.station} className="mt-3">
          <div className="text-mono">
            <a className="vanilla" href={stationDetails.stationUrl}>
              <u className="text-600">{stationDetails.stationTitle}</u>
            </a>
          </div>
        </div>
      );
    });
  }

  buildSection(stations) {
    return stations.map((stationDetails) => {
      return (
        <div key={stationDetails.station} className="mt-3">
          <div className="text-mono">
            <a className="vanilla" href={stationDetails.hostProfileUrl}>
              <u>{stationDetails.host}</u>
            </a>
            <span className="text-600">  /  </span>
            <a className="vanilla" href={stationDetails.stationUrl}>
              <u className="text-600">{stationDetails.stationTitle}</u>
            </a>
          </div>
          <div>{stationDetails.config.con.sis.length} Members</div>
        </div>
      );
    });
  }

  render() {
    let stations = getSubscribedStations(this.props.api.authTokens.ship, this.props.store.configs);
    if (!stations) return null;

    const chatStations = this.buildSection(stations.chatStations);
    const collStations = this.buildSection(stations.collStations);
    const DMStations = this.buildDMSection(stations.dmStations);

    return (
      <div className="container">
        <div className="row">
          <div className="list-page col-sm-10 col-sm-offset-2">
            <div className="mt-9">
              <div className="text-600">Chats</div>
              {chatStations}
            </div>
            <div className="mt-9">
              <div className="text-600">Blogs, Forum and Notes</div>
              {collStations}
            </div>
            <div className="mt-9">
              <div className="text-600">Direct Messages</div>
              {DMStations}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
