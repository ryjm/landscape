import React, { Component } from 'react';

export class CommandHelp extends Component {
  constructor(props) {
    super(props);
  }

  renderBlankHelp() {
    return (
      <div>

      </div>
    )
  }

  renderBlank() {
    return (
      <div>
        <a className="mb-6" onClick={this.props.updateCommand('inbox')}><b>inbox</b></a>
        <a className="mb-6" onClick={this.props.updateCommand('profile')}><b>profile</b></a>
        <a className="mb-6" onClick={this.props.updateCommand('go')}><b>go</b> [~ship/stream]</a>
        <a className="mb-6" onClick={this.props.updateCommand('go')}><b>go</b> [~ship/collection]</a>
        <a className="mb-6" onClick={this.props.updateCommand('dm')}><b>dm</b> [~ship]</a>
        <a className="mb-6" onClick={this.props.updateCommand('go')}><b>dm</b> [~ship-a, ~ship-b, ~ship-c]</a>
        <a className="mb-6" onClick={this.props.updateCommand('new')}><b>new</b> [type]</a>
      </div>
    )
  }

  render() {
    let content;

    switch(this.props.input) {
      case "?":
        content = this.renderBlankHelp();
        break;
      case "":
        content = this.renderBlank();
        break;
    }


    return (
      <div>
        {content}
      </div>
    )
  }
}
