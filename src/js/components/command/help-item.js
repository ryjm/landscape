import React, { Component } from 'react';

export class CommandHelpItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`command-item ${this.props.selected && "command-item-selected"}`}>
        <a onClick={() => this.props.processCommand(this.props.option)}><b>{this.props.option.displayText}</b></a>
        {this.props.helpActivated &&
          <div className="mt-2">{this.props.option.helpText}</div>
        }
      </div>
    )
  }
}
