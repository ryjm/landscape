import React, { Component } from 'react';
import { Button } from '/components/lib/button';
import { getStationDetails, capitalize } from '/lib/util';
import { TRANSITION_LOADING } from '/lib/constants';
import classNames from 'classnames';
import _ from 'lodash';

export class CommandForm extends Component {
  constructor(props) {
    super(props);

    let formData = _.reduce(props.form.fields, (obj, field) => {
      obj[field.name] = "";
      return obj;
    }, {});

    this.state = {
      formData: formData,
      errorList: [],
      focused: ""
    }

    this.valueChange = this.valueChange.bind(this);
    this.focusChange = this.focusChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateField = this.validateField.bind(this);

    this.firstInputRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.firstInputRef.current && this.state.focused === "") this.firstInputRef.current.focus();
  }

  valueChange(e) {
    let stateClone = {...this.state};

    stateClone.formData[e.target.name] = e.target.value;

    let valid = this.validateField(e.target.name, e.target.value);
    if (valid) {
      stateClone.errorList = _.without(stateClone.errorList, e.target.name)
    }

    this.setState(stateClone);
  }

  focusChange(e) {
    console.log("focus! ", e.target.name)

    this.setState({
      focused: e.target.name
    });
  }

  onBlur(e) {
    let valid = this.validateField(e.target.name, e.target.value);

    console.log("valid? ", valid);

    this.setState({
      errorList: (valid) ?
                   _.without(this.state.errorList, e.target.name)
                 : [...this.state.errorList, e.target.name]
    });
  }

  validateField(name, value) {
    let field = _.find(this.props.form.fields, f => f.name === name);

    if (field && field.validate) {
      return field.validate(value);
    }

    return true;
  }

  onSubmit(e) {
    if (e.preventDefault) e.preventDefault();
    this.props.form.submit.bind(this)();
  }

  buildFieldElements(field, first) {
    let input;

    let classes = classNames({
      'input-group': true,
      'input-group-focused': this.state.focused === field.name,
      'input-group-error': this.state.errorList.includes(field.name)
    });

    let inputProps = {
      name: field.name,
      onChange: this.valueChange,
      onFocus: this.focusChange,
      onBlur: this.onBlur,
      value: this.state.formData[name],
      placeholder: field.placeholder
    }

    if (first) inputProps.ref = this.firstInputRef;

    if (field.type === "text") {
      input = <input type="text" {...inputProps} />;
    } else if (field.type === "textarea") {
      input = <textarea {...inputProps} />;
    }

    return (
      <div className={classes} key={field.name}>
        <label>{capitalize(field.name)}</label>
        {input}
        <div className="input-group-error-message">{field.errorMsg}</div>
      </div>
    )
  }

  render() {
    let fieldElems = this.props.form.fields.map((field, i) => {
      return this.buildFieldElements(field, i === 0)
    });

    return (
      <div className="mb-3 form-mve">
        <div className="mt-2 ml-3">Note: All circles are public on the testnet while permissions are built</div>

        {fieldElems}

        <Button
          name="sup"
          classes={`btn btn-sm btn-text btn-block mt-3`}
          focusChange={this.focusChange}
          action={this.onSubmit}
          disabled={this.state.errorList.length > 0}
          content="Create →"
          pushCallback={this.props.pushCallback}
          responseKey="circles"
        />
        <Button
          classes={`btn btn-sm btn-text btn-block red`}
          action={this.props.cancel}
          focusChange={this.focusChange}
          content="Cancel"
          pushCallback={this.props.pushCallback}
        />
      </div>
    )
  }
}
