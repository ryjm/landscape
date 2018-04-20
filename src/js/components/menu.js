import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { calculateStations } from '../util';

export class MenuPage extends Component {
  render() {
    let numStationsString = calculateStations(this.props.store.configs);

    return (
      <div className="container menu-page">
        <div className="row">
          <div className="col-sm-1">
            <div className="cross"></div>
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
              <div className="ml-7">{numStationsString}</div>
            </div>
            <div className="row mb-6">
              <a className="menu-anchor" href="/~~/pages/nutalk/profile">
                <div className="circle mr-7"></div>
                <b>Profile</b>
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
