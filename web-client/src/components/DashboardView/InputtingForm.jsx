import React, { Component } from 'react';
import './InputtingFormStyle.css';

class InputtingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
      }
    
      handleChange(event) {
        this.setState({value: event.target.value});
      }
    
    render() { 
        const inputId = "newInput" + this.props.inputId;
        return (
            <form className="inputting-form" method={this.props.formMethod} target="iframe-result" onSubmit={() => this.props.onSubmit(this.props.formMethod, this.props.apiURL, this.state.value)}>
                <div className="form-group">
                    <label><b>{this.props.labelText}</b></label>
                    <input type={this.props.inputType} className="form-control" id={inputId} placeholder={this.props.inputPlaceHolder}  onChange={this.handleChange}/>
                </div>
                <button type="submit" className="btn">{this.props.btnText}</button>
            </form>
        );
    }
}
 
export default InputtingForm;