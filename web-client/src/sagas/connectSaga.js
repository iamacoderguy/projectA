import { call, put, takeLatest } from 'redux-saga/effects';
import { CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_FAILURE } from '../actions';

import { connectServer } from '../api/requestAPI';

function* connectRequest(params) {
  try {
    const response = yield call(connectServer, params.payload.params);

    if (response.ok) {
      yield put({ type: CONNECT_SUCCESS, response });
    } else {
      yield put({ type: CONNECT_FAILURE, response });
    }
  } catch (error) {
    yield put({ type: CONNECT_FAILURE, error });
  }
}

export function* watchConnectSagasAsync() {
  yield takeLatest(CONNECT_REQUEST, connectRequest);
}
