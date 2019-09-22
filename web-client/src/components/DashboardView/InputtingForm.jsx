import React, { Component } from 'react';
import './InputtingFormStyle.css';

class InputtingForm extends Component {
  render() {
    return (
      <form
        className="inputting-form"
        method={this.props.formMethod}
        action={this.props.apiUrl}
        target={this.props.formTarget}
        encType={this.props.enctype}
      >
        <div className="form-group">
          <label htmlFor={this.props.inputId}>
            <b>{this.props.labelText}</b>
          </label>
          <input
            type={this.props.inputType}
            name={this.props.inputName}
            className="form-control"
            id={this.props.inputId}
            placeholder={this.props.inputPlaceHolder}
          />
        </div>
        <button type="submit" className="btn">
          {this.props.btnText}
        </button>
      </form>
    );
  }
}

export default InputtingForm;
