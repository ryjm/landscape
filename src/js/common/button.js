import React, { Component } from 'react';
import { STATUS_LOADING, STATUS_READY } from './constants';

export class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS_READY
    };

    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick() {
    this.setState({ status: STATUS_LOADING });

    this.props.action(this.props.actionData);

    this.props.pushCallback(this.props.responseKey, (rep) => {
      this.setState({ status: STATUS_READY });
    });
  }

  render() {
    let spinnerClass = (this.state.status !== STATUS_LOADING) ? "hide" : "btn-spinner";

    return (
      <button type="button" className={this.props.classes} onClick={this.buttonClick}>
        <span>{this.props.content}</span>
        <span className={spinnerClass}>◠</span>
      </button>
    )
  }
}
