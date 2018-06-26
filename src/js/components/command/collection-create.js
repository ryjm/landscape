import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getStationDetails } from '/lib/util';
import { TRANSITION_LOADING } from '/lib/constants';
import classNames from 'classnames';
import _ from 'lodash';
import urbitOb from 'urbit-ob';

export class CollectionCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      invites: "",
      visible: "",
      focused: "",
      errorList: []
    };

    this.valueChange = this.valueChange.bind(this);
    this.focusChange = this.focusChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.collectionNameRef = React.createRef();
  }

  valueChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;

    let valid = this.validateField(e.target.name, e.target.value);
    if (valid) {
      obj.errorList = _.without(this.state.errorList, e.target.name)
    }

    this.setState(obj);
  }

  focusChange(e) {
    this.setState({
      focused: e.target.name
    });
  }

  onBlur(e) {
    let valid = this.validateField(e.target.name, e.target.value);

    this.setState({
      errorList: (valid) ?
                   _.without(this.state.errorList, e.target.name)
                 : [...this.state.errorList, e.target.name]
    });
  }

  validateField(name, value) {
    let valid;

    switch (name) {
      case "name":
        valid = value !== "";
        break;
      case "invites":
        valid = this.validateInvites(value)
        break;
      case "visible":
        valid = this.validateVisible(value)
        break;
    }

    return valid;
  }

  getInviteArray(invites) {
    return invites.trim().split("\n").map(t => t.trim());
  }

  validateInvites(invites) {
    if (invites === "") return true;
    let tokens = this.getInviteArray(invites);
    return _.reduce(tokens, (valid, s) => valid && urbitOb.isShip(s) && s.includes("~"), true);
  }

  validateVisible(visible) {
    return visible === "yes" || visible === "no";
  }

  onSubmit() {
    this.props.storeReports([{
      type: "transition",
      data: TRANSITION_LOADING
    }]);

    this.props.api.coll({
      create: {
        desc: this.state.name,
        publ: true,
        visi: this.state.visible === "yes",
        comm: true,
        xeno: true,
        ses: ""
      }
    });

    this.props.pushCallback("circles", (rep) => {
      let station = `~${this.props.api.authTokens.ship}/${rep.data.cir}`;
      let details = getStationDetails(station);

      this.props.api.hall({
        source: {
          nom: 'inbox',
          sub: true,
          srs: [station]
        }
      });

      if (this.state.invites.length > 0) {
        let audInboxes = this.getInviteArray(this.state.invites).map((aud) => `${aud}/inbox`);
        let inviteMessage = {
          aud: audInboxes,
          ses: [{
            inv: {
              inv: true,
              cir: station
            }
          }]
        };

        this.props.api.hall({
          phrase: inviteMessage
        });
      }

      this.props.transitionTo(details.stationUrl);
    });
  }

  render() {
    return (
      <div className="mb-3 collection-create">
        <div className={classNames({
          'input-group': true,
          'input-group-focused': this.state.focused === "name",
          'input-group-error': this.state.errorList.includes("name")
        })}>
          <label>Name</label>
          <input type="text"
            name="name"
            tabIndex="0"
            autoFocus
            ref={this.collectionNameRef}
            onChange={this.valueChange}
            onFocus={this.focusChange}
            onBlur={this.onBlur}
            value={this.state.name}
            placeholder="Deep Thoughts" />
          <div className="input-group-error-message">Name can't be blank</div>
        </div>
        <div className={classNames({
          'input-group': true,
          'input-group-focused': this.state.focused === "invites",
          'input-group-error': this.state.errorList.includes("invites")
        })}>
          <label>Invites</label>
          <textarea type="text"
            name="invites"
            tabIndex="0"
            onChange={this.valueChange}
            onFocus={this.focusChange}
            onBlur={this.onBlur}
            value={this.state.invites}
            placeholder={`~ship-name\n~ship-name`} />
          <div className="input-group-error-message">Invites must be of form ~ship-name \n ~ship-name</div>
        </div>
        <div className={classNames({
          'input-group': true,
          'input-group-focused': this.state.focused === "visible",
          'input-group-error': this.state.errorList.includes("visible")
        })}>
          <label>Show in Profile?</label>
          <input type="text"
            name="visible"
            tabIndex="0"
            onChange={this.valueChange}
            onFocus={this.focusChange}
            onBlur={this.onBlur}
            value={this.state.visible}
            placeholder="'yes' or 'no'" />
          <div className="input-group-error-message">Visibility must be either 'yes' or 'no'</div>
        </div>
        <Button
          classes={`btn btn-sm btn-text btn-block mt-3`}
          onFocus={this.focusChange}
          action={this.onSubmit}
          disabled={this.state.errorList.length > 0}
          content="Create →"
          pushCallback={this.props.pushCallback}
          responseKey="circles"
           />
       <Button
         classes={`btn btn-sm btn-text btn-block red`}
         action={this.props.cancel}
         onFocus={this.focusChange}
         content="Cancel"
         pushCallback={this.props.pushCallback}
          />
      </div>
    )
  }
}
