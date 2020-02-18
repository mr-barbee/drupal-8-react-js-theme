import {
  MEDIA_COLLECTION_PENDING,
  MEDIA_COLLECTION_SUCCESS,
  MEDIA_COLLECTION_ERROR,
} from './../actions';

const initialState = {
  pending: false,
  nodeMediaCollection: {},
  paragraphMediaCollection: {},
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'MEDIA_COLLECTION_PENDING':
      return {
        ...state,
        pending: true
      }
    case 'MEDIA_COLLECTION_SUCCESS':
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
    case 'MEDIA_COLLECTION_ERROR':
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getMediaCollection = state => state.mediaCollectionReducer.nodeMediaCollection
export const getParagraphMediaCollection = state => state.mediaCollectionReducer.paragraphMediaCollection
export const getMediaCollectionPending = state => state.mediaCollectionReducer.pending
export const getMediaCollectionError = state => state.mediaCollectionReducer.error
