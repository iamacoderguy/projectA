import React, { Component } from 'react';

class InputtingForm extends Component {
    state = {
        formMethod: this.props.formMethod,
        formAction: this.props.formAction,
        formTarget: this.props.formTarget,
        labelText: this.props.labelText,
        inputId: this.props.inputId,
        btnText: this.props.btnText
    }

    render() { 
        const inputId = "newInput" + this.state.inputId;
        return (
            <form className="inputting-form" method={this.state.formMethod} action={this.state.formAction} target={this.state.formTarget}>
            <div className="form-group">
                <label>{this.state.labelText}</label>
                <input type="text" className="form-control" id={inputId}/>
            </div>
            <button type="submit" className="btn btn-primary">{this.state.btnText}</button>
            </form>
        );
    }
}
 
export default InputtingForm;