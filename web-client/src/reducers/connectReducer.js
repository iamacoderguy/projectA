import { CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_FAILURE } from '../actions';

const initState = {
  loading: false,
  error: '',
  path: [],
};

export default function connectReducer(state = initState, action) {
  switch (action.type) {
    case CONNECT_REQUEST:
      return Object.assign({}, state, {
        loading: true,
      });

    case CONNECT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        token: state.response,
      });

    case CONNECT_FAILURE:
      console.log('action', action.error);
      return Object.assign({}, state, {
        loading: false,
        error: action.response,
      });

    default:
      return state;
  }
}
