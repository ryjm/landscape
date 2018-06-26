import React, { Component } from 'react';
import { Button } from '/components/lib/button';

export class CollectionCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      invites: [],
      visible: false,
      focused: ""
    };

    this.valueChange = this.valueChange.bind(this);
    this.focusChange = this.focusChange.bind(this);

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

  render() {
    // if (this.collectionNameRef.current) this.collectionNameRef.current.focus();

    return (
      <div className="mb-3 collection-create">
        <div className={`input-group ${this.state.focused === "name" && 'input-group-focused'}`}>
          <label>Name</label>
          <input type="text"
            name="name"
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
            onChange={this.valueChange}
            value={this.state.invites}
            placeholder="~ship-name" />
        </div>
        <div className={`input-group ${this.state.focused === "invites" && 'input-group-focused'}`}>
          <label>Show in Profile?</label>
          <input type="text"
            name="visible"
            onChange={this.valueChange}
            value={this.state.visible}
            placeholder="'yes' or 'no'" />
        </div>
        <Button
          classes={`btn btn-sm btn-primary`}
          action={this.create}
          content="Create →"
          pushCallback={this.props.pushCallback}
          responseKey="circles"
           />
       <Button
         classes={`btn btn-sm btn-secondary`}
         action={this.cancel}
         content="Cancel"
         pushCallback={this.props.pushCallback}
          />
      </div>
    )
  }
}
