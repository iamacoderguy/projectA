import React, { Component } from 'react';
import InputtingForm from './InputtingForm';
import './DashboardViewStyle.css';

class DashboardView extends Component {
  render() {
    return (
      <div>
        <iframe
          className="result-box"
          title="Result box"
          srcDoc="<i>Result...</i>"
          name="iframe-result"
        />

        <div style={{ padding: 16 }}>
          <InputtingForm
            formMethod="POST"
            apiUrl="http://localhost:3000/api/files/path?_method=PUT"
            formTarget="iframe-result"
            labelText="Set a new shared path (/api/files/path)"
            inputId="SharedPath"
            inputName="path"
            inputType="text"
            inputPlaceHolder="path-to-files"
            btnText="PUT"
          />
          <InputtingForm
            formMethod="GET"
            apiUrl="http://localhost:3000/api/files"
            formTarget="iframe-result"
            labelText="Get the shared files list (/api/files)"
            inputId="SharedFilesList"
            inputName=""
            inputType="hidden"
            inputPlaceHolder=""
            btnText="GET"
          />
          <InputtingForm
            formMethod="GET"
            apiUrl="http://localhost:3000/api/files"
            formTarget="_blank"
            labelText="Get a shared file (/api/files/:filename)"
            inputId="FileName"
            inputName="filename"
            inputType="text"
            inputPlaceHolder="filename"
            btnText="GET"
          />

          <InputtingForm
            formMethod="POST"
            apiUrl="http://localhost:3000/api/files"
            formTarget="iframe-result"
            enctype="multipart/form-data"
            labelText="Upload a new file (/api/files)"
            inputId="FilePath"
            inputName="file"
            inputType="file"
            inputPlaceHolder=""
            btnText="POST"
          />
        </div>
      </div>
    );
  }
}

export default DashboardView;
