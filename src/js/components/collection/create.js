import React, { Component } from 'react';
import { util } from '../../util';

export class CollectionCreatePage extends Component {
  constructor(props) {
    super(props);

    this.createCollection = this.createCollection.bind(this);
    this.toggleClasses = this.toggleClasses.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    // Keep our state legible
    this.state = {
      collectionName: '',
      visibility: false,
      comments: true,
      foreignPost: true,
      onProfile: true,
      collectionShips: ''
    };
  }

  createCollection() {
    this.props.api.sendCollAction({
      create: {
        wat: 'blog',
        des: this.state.collectionName,
        pub: this.state.visibility,
        vis: this.state.onProfile,
        // ses needs to be an ace separated list of non-sig ships
        // *GOOD* 'zod polryt-tarnyr binzod'
        // *BAD* '~zod ~polryt-tarnyr ~binzod'
        ses: this.state.collectionShips.replace(/~|,/g, '')
      }
    }, {
      target: '/~~/pages/nutalk'
    });
;
  }

  canSubmit() {
    this.state.collectionName.length > 0
  }

  //TODO These functions should be combined

  valueChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  toggle(event) {
    const target = event.target;
    const name = target.name;
    // must be bool
    const value = (target.value == 'true');

    this.setState({
      [name]: value
    });
  }

  toggleClasses(key, valence) {
    return this.state[key] ? valence ? "btn btn-secondary" : "btn btn-warning" : "btn";
  }

  render() {
    return (
      //<div className="test">
      //  <button onClick={this.createCollection}>Create</button>
      //</div>
      <div className="create-collection-page container">
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
            <button name="visibility" value="true" className={this.state.visibility ? "btn btn-secondary" : "btn"} onClick={this.toggle}>
              Yes
            </button>
            <button name="visibility" value="false" className={this.state.visibility ? "btn" : "btn-warning"} onClick={this.toggle}>
              No
            </button>
          </div>
          <div className="input-group col-md-3">
            <label htmlFor="comments">Comments</label>
            <button name="comments" value="true" className={this.state.comments ? "btn btn-secondary" : "btn"} onClick={this.toggle}>
              Yes
            </button>
            <button name="comments" value="false" className={this.state.comments ? "btn" : "btn-warning"} onClick={this.toggle}>
              No
            </button>
          </div>
          <div className="input-group col-md-3">
            <label htmlFor="foreignPost">Others can post</label>
            <button name="foreignPost" value="true" className={this.state.foreignPost ? "btn btn-secondary" : "btn"} onClick={this.toggle}>
              Yes
            </button>
            <button name="foreignPost" value="false" className={this.state.foreignPost ? "btn" : "btn-warning"} onClick={this.toggle}>
              No
            </button>
          </div>
        </div>
        <div className="row">
          <div className="input-group col-md-3">
            <label htmlFor="onProfile">On profile</label>
            <button name="onProfile" value="true" className={this.state.onProfile ? "btn btn-secondary" : "btn"} onClick={this.toggle}>
              Yes
            </button>
            <button name="onProfile" value="false" className={this.state.onProfile ? "btn" : "btn-warning"} onClick={this.toggle}>
              No
            </button>
          </div>
        </div>
        <div className="input-group">
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
    )
  }
}
