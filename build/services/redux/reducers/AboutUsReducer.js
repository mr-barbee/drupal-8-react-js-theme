import {
  ABOUT_US_PENDING,
  ABOUT_US_SUCCESS,
  ABOUT_US_ERROR,
} from './../actions';

const initialState = {
  pending: false,
  nodeAboutUs: {},
  paragraphArtists: {},
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'ABOUT_US_PENDING':
      return {
        ...state,
        pending: true
      }
    case 'ABOUT_US_SUCCESS':
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
    case 'ABOUT_US_ERROR':
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getAboutUs = state => state.aboutReducer.nodeAboutUs
export const getParagraphArtists = state => state.aboutReducer.paragraphArtists
export const getAboutUsPending = state => state.aboutReducer.pending
export const getAboutUsError = state => state.aboutReducer.error
