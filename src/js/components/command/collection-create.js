import React, { Component } from 'react';
import { Button } from '/components/lib/button';

export class CollectionCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      invites: [],
      visible: "",
      focused: ""
    };

    this.valueChange = this.valueChange.bind(this);
    this.focusChange = this.focusChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.collectionNameRef = React.createRef();
  }

  valueChange(e) {
    let obj = {};

    obj[e.target.name] = obj[e.target.value]

    this.setState(obj);
  }

  focusChange(e) {
    this.setState({
      focused: e.target.name
    });
  }

  onSubmit() {
    console.log('submitting!')
  }

  render() {
    return (
      <div className="mb-3 collection-create">
        <div className={`input-group ${this.state.focused === "name" && 'input-group-focused'}`}>
          <label>Name</label>
          <input type="text"
            name="name"
            tabIndex="0"
            autoFocus
            ref={this.collectionNameRef}
            onChange={this.valueChange}
            onFocus={this.focusChange}
            value={this.state.name}
            placeholder="Deep Thoughts" />
        </div>
        <div className={`input-group ${this.state.focused === "invites" && 'input-group-focused'}`}>
          <label>Invites</label>
          <textarea type="text"
            name="invites"
            tabIndex="0"
            onChange={this.valueChange}
            onFocus={this.focusChange}
            value={this.state.invites}
            placeholder={`~ship-name\n~ship-name`} />
        </div>
        <div className={`input-group ${this.state.focused === "visible" && 'input-group-focused'}`}>
          <label>Show in Profile?</label>
          <input type="text"
            name="visible"
            tabIndex="0"
            onChange={this.valueChange}
            onFocus={this.focusChange}
            value={this.state.visible}
            placeholder="'yes' or 'no'" />
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
