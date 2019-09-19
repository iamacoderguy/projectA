import React from 'react';
import { connect } from 'react-redux';
import { putPathRequest, connectRequest } from '../../actions';
import FormControl from './formControl';

import './styles/index.css';

const Dashboard = props => (
  <div className="container">
    <textarea
      className="result-box"
      defaultValue="Ea voluptate adipisicing consequat officia cupidatat ullamco eu voluptate labore nisi ipsum. Eiusmod sint ipsum nulla eu commodo officia ut. Ipsum magna ullamco laborum laboris. Dolor fugiat exercitation exercitation incididunt proident occaecat id exercitation. Magna exercitation exercitation reprehenderit id commodo exercitation non et cillum ex sint sunt in sint. Id exercitation amet ea ipsum eiusmod ex elit. Deserunt duis irure sint non voluptate dolor aute ex culpa labore veniam amet.
        Culpa quis elit ullamco ex irure officia ullamco ea laboris voluptate fugiat voluptate pariatur. Duis nulla anim laborum voluptate quis occaecat exercitation nisi. Do aute magna velit eiusmod enim ullamco qui proident voluptate aute enim aliquip do. Elit non duis irure velit anim anim nostrud adipisicing excepteur eu dolor qui."
    />

    <FormControl
      labelText="Connect to server with pin (/api/auth/pin)"
      inputId="SharedPath"
      inputName="path"
      inputType="text"
      inputPlaceHolder="pin"
      btnText="POST"
      putPathRequest={props.connectRequest}
    />

    <FormControl
      formTarget="iframe-result"
      labelText="Set a new shared path (/api/files/path)"
      inputId="SharedPath"
      inputName="path"
      inputType="text"
      inputPlaceHolder="path-to-files"
      btnText="PUT"
      putPathRequest={props.putPathRequest}
    />
  </div>
);
export default connect(
  state => ({ path: state.path, error: state.error, token: state.connect }),
  {
    putPathRequest,
    connectRequest,
  }
)(Dashboard);
