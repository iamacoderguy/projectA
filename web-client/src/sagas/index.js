import { all, fork } from 'redux-saga/effects';
import { watchPathSagasAsync } from './pathSaga';
import { watchConnectSagasAsync } from './connectSaga';

export default function* sagas() {
  yield all([fork(watchPathSagasAsync)]);
  yield all([fork(watchConnectSagasAsync)]);
}
