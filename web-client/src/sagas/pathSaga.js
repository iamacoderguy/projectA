import { call, put, takeLatest } from 'redux-saga/effects';
import {
  PUT_PATH_REQUEST,
  PUT_PATH_SUCCESS,
  PUT_PATH_FAILURE,
} from '../actions';

import { putPath } from '../api/requestAPI';

function* putPathRequest() {
  try {
    const response = yield call(putPath);

    if (response.ok) {
      yield put({ type: PUT_PATH_SUCCESS, response });
    } else {
      console.log('saga response', response);
      yield put({ type: PUT_PATH_FAILURE, response });
    }
  } catch (error) {
    yield put({ type: PUT_PATH_FAILURE, error });
  }
}

export function* watchPathSagasAsync() {
  yield takeLatest(PUT_PATH_REQUEST, putPathRequest);
}
