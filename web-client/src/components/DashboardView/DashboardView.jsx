import React, { Component } from "react";
import InputtingForm from "./InputtingForm";
import "./DashboardViewStyle.css";

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
            onSubmit={this.props.onSubmit}
            formMethod="POST"
            apiURL="http://localhost:3000/api/files/path?_method=PUT"
            labelText="Set a new shared path (/api/files/path)"
            inputId="SharedPath"
            inputType="text"
            inputPlaceHolder="path-to-files"
            btnText="PUT"
          />
          <InputtingForm
            formMethod="GET"
            apiURL="http://localhost:3000//api/files"
            labelText="Get the shared files list (/api/files)"
            inputId="SharedFilesList"
            inputType="hidden"
            inputPlaceHolder=""
            btnText="GET"
          />
          <InputtingForm
            formMethod="GET"
            labelText="Get a shared file (/api/files/:filename)"
            inputId="FileName"
            inputType="text"
            inputPlaceHolder="filename"
            btnText="GET"
          />

          <InputtingForm
            formMethod="POST"
            labelText="Upload a new file (/api/files)"
            inputId="FilePath"
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
