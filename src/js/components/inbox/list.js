import React, { Component } from 'react';
import { getSubscribedStations } from '/lib/util';
import { Icon } from '/components/lib/icon';
import { Elapsed } from '/components/lib/elapsed';
import classnames from 'classnames';

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
              {stationDetails.stationTitle}
            </a>
          </div>
        </div>
      );
    });
  }

  buildSection(stations) {
    return stations.map((stationDetails) => {
      let stationClass = classnames({
        'text-mono': !stationDetails.type.includes("collection"),
        'text-heading': stationDetails.type.includes("collection"),
        'text-700': true
      });

      return (
        <div key={stationDetails.station} className="mt-3 row align-center">
          <div className="text-mono flex-col-3 flex-offset-2">
            {stationDetails.type !== "stream-dm" &&
              <React.Fragment>
                <a className="text-host-breadcrumb" href={stationDetails.hostProfileUrl}>
                  ~{stationDetails.host}
                </a>
                <span className="text-host-breadcrumb ml-2 mr-2">/</span>
              </React.Fragment>
            }
            <a className={stationClass} href={stationDetails.stationUrl}>
              {stationDetails.stationTitle}
            </a>
          </div>
          <div className="flex-col-1">
            <Elapsed timestring={1538163986689} classes="text-host-breadcrumb" />
          </div>
          <div className="flex-col-1 flex align-center">
            <Icon type="icon-user" label={true} />
            <span className="text-host-breadcrumb">122</span>
          </div>
        </div>
      );
    });
  }

  render() {
    let stations = getSubscribedStations(this.props.api.authTokens.ship, this.props.store);
    if (!stations) return null;

    const chatStations = this.buildSection(stations.chatStations);
    const collStations = this.buildSection(stations.collStations);
    const DMStations = this.buildSection(stations.dmStations);

    let sections = [{
      title: "Chats",
      icon: "icon-stream-chat",
      data: chatStations,
    }, {
      title: "Forum",
      icon: "icon-collection-index",
      data: collStations
    }, {
      title: "Direct Messages",
      icon: "icon-stream-dm",
      data: DMStations
    }];

    let sectionElems = sections.map(s => {
      return (
        <div className="mt-4 mb-17">
          <div className="row">
            <div className="flex-col-2 flex justify-end align-center">
              <Icon type={s.icon} label={true} />
            </div>
            <div className="flex-col-x">
              <h2 className="text-500">{s.title}</h2>
            </div>
          </div>
          {s.data}
        </div>
      );
    });

    return sectionElems;
  }
}
