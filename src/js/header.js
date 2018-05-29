import React, { Component } from 'react';
import { IconBlog } from './icons/icon-blog';

export class Header extends Component {
  getContent() {
    switch(this.props.type) {
      case "collection-index":
        return (
          <div className="flex space-between">
            <div className="flex align-center">
              <a href="/~~/pages/nutalk/menu" className="mr-22">
                <div className="panini"></div>
              </a>
              <div className="mr-8"><IconBlog /></div>
              <h3>Urbit Development</h3>
            </div>
            <div className="flex align-center">
              <a href="/~~/details" className="header-link mr-6">Details</a>
              <a href="/~~/subscribe">
                <button type="button" className="btn btn-sm btn-primary">Subscribe</button>
              </a>
            </div>
          </div>
        )
        break;
      default:
        return null;
        break;
    }
  }

  render() {
    return (
      <div className="header-container">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              {this.getContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
