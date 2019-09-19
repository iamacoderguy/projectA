export const PUT_PATH_REQUEST = 'PUT_PATH_REQUEST';
export const PUT_PATH_SUCCESS = 'PUT_PATH_SUCCESS';
export const PUT_PATH_FAILURE = 'PUT_PATH_FAILURE';
export const CONNECT_REQUEST = 'CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS';
export const CONNECT_FAILURE = 'PUT_PATH_FAILURE';

export const putPathRequest = params => ({
  type: PUT_PATH_REQUEST,
  payload: {
    params,
  },
});

export const connectRequest = params => ({
  type: CONNECT_REQUEST,
  payload: {
    params,
  },
});
