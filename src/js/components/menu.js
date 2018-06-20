import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getSubscribedStations } from '/lib/util';

export class MenuPage extends Component {
  crossClick() {
    window.history.back();
  }

  render() {
    let subscribedStations = getSubscribedStations(this.props.api.authTokens.ship, this.props.store.configs);
    let numStationsString = (subscribedStations) ? subscribedStations.numString : null;

    return (
      <div className="container menu-page">
        <div className="row">
          <div className="col-sm-1">
            <div className="cross" onClick={this.crossClick}></div>
          </div>
          <div className="col-sm-11">
            <div className="row mb-6">
              <a className="menu-anchor" href="/~~/pages/nutalk">
                <div className="circle mr-7"></div>
                <b>Inbox</b>
              </a>
            </div>
            <div className="row mb-6">
              <a className="menu-anchor" href="/~~/pages/nutalk/list">
                <div className="circle mr-7"></div>
                <b>List</b>
              </a>
              <div className="ml-7 pt-1">{numStationsString}</div>
            </div>
            <div className="row mb-6">
              <a className="menu-anchor" href={`/~~/${this.props.ship}/==/web/pages/nutalk/profile`}>
                <div className="circle mr-7"></div>
                <b>Profile</b>
              </a>
            </div>
            <div className="row mb-6">
              <a className="menu-anchor" href="/~~/pages/nutalk/stream/create">
                <div className="circle mr-7"></div>
                <b>Create stream</b>
              </a>
            </div>
            <div className="row mb-6">
              <a className="menu-anchor" href="/~~/pages/nutalk/collection/create">
                <div className="circle mr-7"></div>
                <b>Create collection</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.querySelectorAll('.header-container')[0].classList.add('hide');
  }

  componentWillUnmount() {
    document.querySelectorAll('.header-container')[0].classList.remove('hide');
  }
}
