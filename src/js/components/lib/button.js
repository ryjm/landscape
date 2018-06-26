import React, { Component } from 'react';
import { STATUS_LOADING, STATUS_READY } from '/lib/constants';

export class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS_READY
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    if (e.preventDefault) e.preventDefault();

    this.setState({ status: STATUS_LOADING });

    this.props.action(this.props.actionData);

    if (this.props.responseKey) {
      this.props.pushCallback(this.props.responseKey, (rep) => {
        this.setState({ status: STATUS_READY });
      });
    }
  }

  render() {
    let spinnerClass = (this.state.status !== STATUS_LOADING) ? "hide" : "btn-spinner";

    return (
      <form onSubmit={this.onSubmit} style={{display: 'inline-block'}}>
        <button type="submit"
          className={this.props.classes}
          onFocus={this.props.onFocus}
          disabled={this.props.disabled}
          tabIndex="0">
            <span>{this.props.content}</span>
            <span className={spinnerClass}>◠</span>
        </button>
      </form>
    )
  }
}
