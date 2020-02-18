import {
  VIDEOSCREEN_PENDING,
  VIDEOSCREEN_SUCCESS,
  VIDEOSCREEN_ERROR,
} from './../actions';

const initialState = {
  pending: false,
  nodeVideoscreen: {},
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'VIDEOSCREEN_PENDING':
      return {
        ...state,
        pending: true
      }
    case 'VIDEOSCREEN_SUCCESS':
      let $return = {
        ...state,
        pending: false,
      }
      action.operationType.forEach(type => {
        $return[type] = {
          ...state[type],
          ...action.payload[type]
        }
      })
      return $return;
    case 'VIDEOSCREEN_ERROR':
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getVideoscreen = state => state.videoscreenReducer.nodeVideoscreen
export const getVideoscreenPending = state => state.videoscreenReducer.pending
export const getVideoscreenError = state => state.videoscreenReducer.error
