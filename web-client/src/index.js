import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
