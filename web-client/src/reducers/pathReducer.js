import {
  PUT_PATH_REQUEST,
  PUT_PATH_SUCCESS,
  PUT_PATH_FAILURE,
} from '../actions';

const initState = {
  loading: false,
  error: '',
  path: [],
};

export default function pathReducer(state = initState, action) {
  switch (action.type) {
    case PUT_PATH_REQUEST:
      return Object.assign({}, state, {
        loading: true,
      });

    case PUT_PATH_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        path: state.response,
      });

    case PUT_PATH_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: action.response,
      });

    default:
      return state;
  }
}
