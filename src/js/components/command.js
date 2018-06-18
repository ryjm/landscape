import React, { Component } from 'react';

export class CommandMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: ""
    }

    this.onCommandChange = this.onCommandChange.bind(this);
    this.onCommandSubmit = this.onCommandSubmit.bind(this);

    this.commandInputRef = React.createRef();
  }

  onCommandChange(e) {
    this.setState({command: e.target.value});
  }

  onCommandSubmit() {

  }

  render() {
    console.log('sup!');

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
          </div>
        </div>
      </div>
    )
  }
}
