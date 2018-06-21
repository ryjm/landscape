import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import { CommandHelp } from '/components/command/help';

export class CommandMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: ""
    }

    this.onCommandChange = this.onCommandChange.bind(this);
    this.onCommandSubmit = this.onCommandSubmit.bind(this);
    this.updateCommand = this.updateCommand.bind(this);
    this.executeCommand = this.executeCommand.bind(this);

    this.commandInputRef = React.createRef();
  }

  componentDidMount() {
    Mousetrap.bind('down', () => {
      console.log('down');
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind('down');
  }

  onCommandChange(e) {
    this.setState({command: e.target.value});
  }

  onCommandSubmit() {

  }

  updateCommand() {

  }

  getRootOptionList() {
    return [{
      name: "inbox",
      helpText: "Go to the inbox",
      action: () => {
        this.props.transitionTo('/~~/pages/nutalk');
      },
    }, {
      name: "profile",
      helpText: "Go to your profile. Settings and log out are also here",
      action: () => {
        this.props.transitionTo(`/~~/~${this.props.api.authTokens.ship}/==/web/pages/nutalk/profile`);
      },
    }, {
      name: "go",
      action: "update",
      helpFormat: "[~ship/stream]",
      helpText: "Go to <stream> on <~ship>",
    }, {
      name: "go",
      action: "update",
      helpFormat: "[~ship/collection]",
      helpText: "Go to <collection> on <~ship>",
    }, {
      name: "dm",
      action: "update",
      helpFormat: "[~ship]",
      helpText: "Go to your dm with <~ship>, or start a new dm with <~ship>",
    }, {
      name: "go",
      action: "update",
      helpFormat: "[~ship-a, ~ship-b, ~ship-c]",
      helpText: "Go to your dm with a group of <[~ship-a, ~ship-b, ~ship-c]>, or start a new dm with <[~ship-a, ~ship-b, ~ship-c]>",
    }];
  }

  getAdditionalOptions(cmd) {
    if (cmd.startsWith("go ~")) {

    }
  }

  getOptionList() {
    let cmd = this.state.command;

    let rootOptions = this.getRootOptionList();
    let additionalOptions = this.getAdditionalOptions(cmd);

    let options = rootOptions.concat(additionalOptions);
  }

  executeCommand(cmd, arg) {
    switch (cmd) {
      case "inbox":
        this.props.transitionTo('/~~/pages/nutalk');
        break;
      case "profile":
        this.props.transitionTo(`/~~/~${this.props.api.authTokens.ship}/==/web/pages/nutalk/profile`);
        break;
    }
  }

  render() {
    if (this.commandInputRef.current) this.commandInputRef.current.focus();

    return (
      <div className="container menu-page">
        <div className="row">
          <div className="col-sm-1">
            <div className="cross" onClick={this.crossClick}></div>
          </div>
          <div className="col-sm-11">
            <input type="text"
                   name="command-input"
                   className="command-menu-input"
                   placeholder="type a command, page or ? for help"
                   onChange={this.onCommandChange}
                   onSubmit={this.onCommandSubmit}
                   value={this.state.command}
                   ref={this.commandInputRef}/>

            <div className="mt-12">
              <CommandHelp
                command={this.state.command}
                updateCommand={this.updateCommand}
                executeCommand={this.executeCommand}
                />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
