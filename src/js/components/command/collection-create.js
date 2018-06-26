import React, { Component } from 'react';
import { Button } from '/components/lib/button';
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
    this.validateField = this.validateField.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.collectionNameRef = React.createRef();
  }

  valueChange(e) {
    let obj = {};

    obj[e.target.name] = e.target.value;

    this.setState(obj);
  }

  focusChange(e) {
    this.setState({
      focused: e.target.name
    });
  }

  validateField(e) {
    let validated;

    switch (e.target.name) {
      case "name":
        validated = true;
        break;
      case "invites":
        validated = this.validateInvites(this.state.invites)
        break;
      case "visible":
        validated = this.validateVisible(this.state.visible)
        break;
    }

    this.setState({
      errorList: (validated) ?
                   _.without(this.state.errorList, e.target.name)
                 : [...this.state.errorList, e.target.name]
    });
  }

  validateInvites(invites) {
    if (invites === "") return true;
    let tokens = invites.trim().split("\n").map(t => t.trim());
    return _.reduce(tokens, (valid, s) => valid && urbitOb.isShip(s), true);
  }

  validateVisible(visible) {
    return visible === "yes" || visible === "no" || visible === "";
  }

  onSubmit() {
    console.log('submitting!')
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
            onBlur={this.validateField}
            value={this.state.name}
            placeholder="Deep Thoughts" />
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
            onBlur={this.validateField}
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
            onBlur={this.validateField}
            value={this.state.visible}
            placeholder="'yes' or 'no'" />
          <div className="input-group-error-message">Visibility must be either 'yes' or 'no'</div>
        </div>
        <Button
          classes={`btn btn-sm btn-text btn-block mt-3`}
          onFocus={this.focusChange}
          action={this.onSubmit}
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
