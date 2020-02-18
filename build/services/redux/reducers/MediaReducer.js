import {
  MEDIA_PENDING,
  MEDIA_SUCCESS,
  MEDIA_ERROR,
} from './../actions';

const initialState = {
  pending: false,
  mediaImage: {},
  mediaVideo: {},
  mediaRemoteVideo: {},
  fileFile: {},
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'MEDIA_PENDING':
      return {
        ...state,
        pending: action.isPending
      }
    case 'MEDIA_SUCCESS':
      let $return = {
        ...state
      }
      action.operationType.forEach(type => {
        $return[type] = {
          ...state[type],
          ...action.payload[type]
        }
      })
      return $return;
    case 'MEDIA_ERROR':
      return {
        ...state,
        pending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getMediaImage = state => state.mediaReducer.mediaImage
export const getMediaRemoteVideo = state => state.mediaReducer.mediaRemoteVideo
export const getMediaVideo = state => state.mediaReducer.mediaVideo
export const getFile = state => state.mediaReducer.fileFile
export const getMediaPending = state => state.mediaReducer.pending
export const getMediaError = state => state.mediaReducer.error
