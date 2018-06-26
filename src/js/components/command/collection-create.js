import React, { Component } from 'react';
import { Button } from '/components/lib/button';

export class CollectionCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      invites: [],
      visible: false,
    };
  }

  render() {
    return (
      <div className="mb-3">
        <div className="input-group">
          <label>Name</label>
          <input type="text"
            name="name"
            onChange={this.onValueChange}
            value={this.state.name}
            placeholder="Deep Thoughts" />
        </div>
        <div className="input-group">
          <label>Invites</label>
          <textarea type="text"
            name="invites"
            onChange={this.onValueChange}
            value={this.state.invites}
            placeholder="~ship-name" />
        </div>
        <div className="input-group">
          <label>Show in Profile?</label>
          <textarea type="text"
            name="visible"
            onChange={this.onValueChange}
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
