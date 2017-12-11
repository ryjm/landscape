import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class MenuPage extends Component {
  render() {
    return (
      <div className="menu-canvas">
        <Link to="/"><div className="cross ml-8 mt-12"></div></Link>
        <div id="star-six"></div>
      </div>
    );
  }
}
