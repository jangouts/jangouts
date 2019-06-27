import { combineReducers } from 'redux';

import participantsReducer from './participants';

export default combineReducers({
  participants: participantsReducer
});
