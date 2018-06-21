import React, { Component } from 'react';

export class CommandHelp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Mousetrap.bind('down', () => {
      console.log('down');
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind('down');
  }

  renderBlankHelp() {
    return (
      <div>
        <h3>Help text!</h3>
      </div>
    )
  }

  renderBlank(help) {
    let items = [{

    }]



    return (
      <div>
        <div className="mb-6">
          <a onClick={() => this.props.executeCommand('inbox')}><b>inbox</b></a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.executeCommand('profile')}><b>profile</b></a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.updateCommand('go')}><b>go</b> [~ship/stream]</a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.updateCommand('go')}><b>go</b> [~ship/collection]</a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.updateCommand('dm')}><b>dm</b> [~ship]</a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.updateCommand('go')}><b>dm</b> [~ship-a, ~ship-b, ~ship-c]</a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
        <div className="mb-6">
          <a onClick={() => this.props.updateCommand('new')}><b>new</b> [type]</a>
          {help &&
            <div className="mt-2">Some help text</div>
          }
        </div>
      </div>
    )
  }

  buildHelpContent() {
    let content;

    switch(this.props.command) {
      case "?":
        content = this.renderBlank(true);
        break;
      case "":
        content = this.renderBlank(false);
        break;
    }

    return content;
  }

  render() {
    let content = this.buildHelpContent();

    return (
      <div className="command-help">
        {content}
      </div>
    )
  }
}

class CommandHelpItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // this.props.actionType = "exec" or "update"
    // this.props.actionName = "go" "dm" etc
    // this.props.helpActivated = bool
    // this.props.helpText = bool
    // this.props.helpFormat = bool
    // this.props.selected = bool

    let action = () => {
      if (this.props.actionType === 'exec') {
        this.props.executeCommand(this.props.actionName)
      } else if (this.props.actionType === 'update') {
        this.props.updatecommand(this.props.actionName)
      }
    }

    let selectedStar = (this.props.selected) ? "*" : "";

    return (
      <div className={`command-item ${this.props.selected && "command-item-selected"}`}>
        <a onClick={action}>{selectedStar}<b>{this.props.actionName}</b> {this.props.helpFormat}</a>
        {this.props.help &&
          <div className="mt-2">{this.props.helpText}</div>
        }
      </div>
    )
  }
}
