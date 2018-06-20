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
