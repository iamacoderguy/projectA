import React, { Component } from 'react';
import InputtingForm from './InputtingForm';
import './DashboardFormStyle.css';

class DashboardForms extends Component {
    state = {  }

    render() { 
        return (
            <div style={{padding: 16}}>
                <InputtingForm 
                    formMethod = "POST"
                    formAction = "/api/files/path?_method=PUT"
                    formTarget = ""
                    labelText = "Set a new shared path (/api/files/path)"
                    inputId = "SharedPath"
                    btnText = "PUT"
                />
                <InputtingForm 
                    formMethod = "GET"
                    formAction="/api/files"
                    formTarget = ""
                    labelText = "Get a shared file (/api/files/:filename)"
                    inputId = "FileName"
                    btnText = "GET"
                />
            </div>
        );
    }
}
 
export default DashboardForms;