import { combineReducers } from 'redux';

import roomReducer from './room';
import participantsReducer from './participants';
import messagesReducer from './messages';

export default combineReducers({
  room: roomReducer,
  participants: participantsReducer,
  messages: messagesReducer
});
