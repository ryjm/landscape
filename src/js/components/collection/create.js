import React, { Component } from 'react';
//import { util } from '../../util';
import urbitOb from 'urbit-ob';

export class CollectionCreatePage extends Component {
  constructor(props) {
    super(props);

    this.createCollection = this.createCollection.bind(this);
    this.toggleClasses = this.toggleClasses.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    // Keep our state legible
    this.state = {
      collectionName: '',
      visibility: false,
      comments: true,
      foreignPost: true,
      onProfile: true,
      collectionShips: '',
      // start with true so that we don't have a red default
      sesValidated: true
    };
  }

  createCollection() {
    this.props.api.coll({
      create: {
        desc: this.state.collectionName,
        publ: this.state.visibility,
        visi: this.state.onProfile,
        comm: this.state.comments,
        xeno: this.state.foreignPost,
        // ses needs to be an ace separated list of non-sig ships
        // *GOOD* 'zod polryt-tarnyr binzod'
        // *BAD* '~zod ~polryt-tarnyr ~binzod'
        ses: this.state.collectionShips.replace(/~|,/g, '')
      }
    });

    this.props.pushCallback("circles", (rep) => {
      api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [`~${this.props.api.authTokens.ship}/${rep.data.cir}`]
        }
      })
    })

    this.props.pushCallback("circle.config.dif.full", (rep) => {
      let collID = rep.data.src[0].split("/")[1].substr(12);
      let url = `/~~/collections/${collID}`;
      window.router.transitionTo(url);
    });
  }

  // make sure that the white/blacklist is composed of ships
  valSes(ses) {
    const sesArray = ses.replace(/,/g, '').split(' ');
    const offenders = sesArray.filter(s => !urbitOb.isShip(s));
    // might want to return offending ships?
    return offenders.length == 0;
  }

  canSubmit() {
    this.state.collectionName.length > 0
  }

  valueChange(event) {
    const target = event.target;
    const name = target.name;
    const value = typeof this.state[name] == 'boolean' ? (target.value == 'true') : target.value;
    if (name == 'collectionShips') {
      this.state.sesValidated = this.valSes(value);
    }

    this.setState({
      [name]: value
    });
  }

  toggleClasses(key, valence) {
    return this.state[key] ? valence ? "btn btn-secondary" : "btn btn-warning" : "btn";
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-2 col-sm-10">
            <div>
              <div className="input-group">
                <label htmlFor="collectionName">Name</label>
                <input
                  type="text"
                  name="collectionName"
                  placeholder="deep-thoughts"
                  onChange={this.valueChange}
                  value={this.state.collectionName}/>
              </div>
              <div className="row">
                <div className="input-group col-md-3">
                  <label htmlFor="visibility">Public</label>
                  <button name="visibility" value="true" className={this.state.visibility ? "btn btn-secondary" : "btn"} onClick={this.valueChange}>
                    Yes
                  </button>
                  <button name="visibility" value="false" className={this.state.visibility ? "btn" : "btn-warning"} onClick={this.valueChange}>
                    No
                  </button>
                </div>
                <div className="input-group col-md-3">
                  <label htmlFor="comments">Comments</label>
                  <button name="comments" value="true" className={this.state.comments ? "btn btn-secondary" : "btn"} onClick={this.valueChange}>
                    Yes
                  </button>
                  <button name="comments" value="false" className={this.state.comments ? "btn" : "btn-warning"} onClick={this.valueChange}>
                    No
                  </button>
                </div>
                <div className="input-group col-md-3">
                  <label htmlFor="foreignPost">Others can post</label>
                  <button name="foreignPost" value="true" className={this.state.foreignPost ? "btn btn-secondary" : "btn"} onClick={this.valueChange}>
                    Yes
                  </button>
                  <button name="foreignPost" value="false" className={this.state.foreignPost ? "btn" : "btn-warning"} onClick={this.valueChange}>
                    No
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="input-group col-md-3">
                  <label htmlFor="onProfile">On profile</label>
                  <button name="onProfile" value="true" className={this.state.onProfile ? "btn btn-secondary" : "btn"} onClick={this.valueChange}>
                    Yes
                  </button>
                  <button name="onProfile" value="false" className={this.state.onProfile ? "btn" : "btn-warning"} onClick={this.valueChange}>
                    No
                  </button>
                </div>
              </div>
              <div className={this.state.sesValidated ? "input-group" : "input-group error"}>
                <label htmlFor="collection-ships">{this.state.visibility ? 'Blacklist' : 'Whitelist'}</label>
                <textarea
                  name="collectionShips"
                  placeholder="poldec-tonteg sorreg-namtyv"
                  value={this.state.collectionShips}
                  onChange={this.valueChange}
                  />
              </div>
              <button type="submit" className={this.state.collectionName.length > 0 ? "btn btn-primary" : "btn disabled"} onClick={this.canSubmit ? this.createCollection : null}> Create →</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
