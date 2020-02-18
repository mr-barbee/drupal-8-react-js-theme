import { combineReducers } from 'redux';
import mediaCollectionReducer from './MediaCollectionReducer';
import videoscreenReducer from './VideoscreenReducer';
import aboutReducer from './AboutUsReducer';
import commerceReducer from './CommerceStoreReducer';
import mediaReducer from './MediaReducer';

export default combineReducers({
  mediaCollectionReducer,
  videoscreenReducer,
  aboutReducer,
  commerceReducer,
  mediaReducer
});
