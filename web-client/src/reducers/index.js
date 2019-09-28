import { combineReducers } from 'redux';
import connectReducer from './connectReducer';
import pathReducer from './pathReducer';

export default combineReducers({
  connect: connectReducer,
  path: pathReducer,
});
