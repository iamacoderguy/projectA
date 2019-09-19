import React, { Component } from 'react';
import './styles/index.css';

class FormControl extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
  }

  handleChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleClick = () => {
    this.props.putPathRequest(this.state.inputValue);
  };

  render() {
    const {
      inputId,
      labelText,
      inputType,
      inputName,
      inputPlaceHolder,
      btnText,
    } = this.props;

    return (
      <>
        <div className="form-group">
          <label htmlFor={inputId}>
            <b>{labelText}</b>
          </label>
          <input
            type={inputType}
            name={inputName}
            className="form-control"
            id={inputId}
            placeholder={inputPlaceHolder}
            onChange={this.handleChange}
          />
        </div>

        <button onClick={this.handleClick} className="btn-primary">
          {btnText}
        </button>
      </>
    );
  }
}

export default FormControl;
