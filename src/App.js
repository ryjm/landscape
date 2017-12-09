import React, { Component } from 'react';
import './css/base.css';
import './css/base-additions.css';
import './css/main.css';
import './css/pages.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { NotesIndexPage } from './components/notes-index.js';
import { NotesEditPage } from './components/notes-edit.js';
import { NotesShowPage } from './components/notes-show.js';
import { MenuPage } from './components/menu.js';
import "./bootstrap.js";

class NutalkLoader extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="menu-main">
            <Link to="/menu"><div className="panini"></div></Link>
            <div className="liang"></div>
          </div>

          <div className="container breadcrumbs-main">
            <div className="row">
              <div className="col-sm-offset-1">
                <h3 className="underline text-gray"><Link to="/">Inbox</Link></h3>
              </div>
            </div>
          </div>

          <div className="main-body">
            <ul className="nav-main">
              <li><Link to="/">Index</Link></li>
              <li><Link to="/show">Show</Link></li>
              <li><Link to="/edit">Edit</Link></li>
              <li><Link to="/menu">Menu</Link></li>
            </ul>

            <Route exact path="/" component={NotesIndexPage} />
            <Route exact path="/show" component={NotesShowPage} />
            <Route exact path="/edit" component={NotesEditPage} />
            <Route path="/menu" component={MenuPage} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default NutalkLoader;
