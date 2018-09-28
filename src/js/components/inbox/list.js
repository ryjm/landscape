import React, { Component } from 'react';
import { getSubscribedStations } from '/lib/util';
import { Icon } from '/components/lib/icon';

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
    let stations = getSubscribedStations(this.props.api.authTokens.ship, this.props.store);
    if (!stations) return null;

    const chatStations = this.buildSection(stations.chatStations);
    const collStations = this.buildSection(stations.collStations);
    const DMStations = this.buildDMSection(stations.dmStations);

    let sections = [{
      title: "Chats",
      icon: "icon-stream-chat",
      data: chatStations,
    }, {
      title: "Forum",
      icon: "icon-collection",
      data: collStations
    }, {
      title: "Direct Messages",
      icon: "icon-stream-dm",
      data: DMStations
    }];

    let sectionElems = sections.map(s => {
      return (
        <div className="mt-9 mb-17">
          <div className="row">
            <div className="flex-col-2 flex justify-end align-center">
              <Icon type={s.icon} label={true} />
            </div>
            <div className="flex-col-x">
              <h2 className="text-500">{s.title}</h2>
            </div>
          </div>
          <div className="row">
            <div className="flex-col-2"></div>
            <div className="flex-col-x">
              {s.data}
            </div>
          </div>
        </div>
      );
    });

    return sectionElems;
  }
}
