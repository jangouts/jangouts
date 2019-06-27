import { combineReducers } from 'redux';

import participantsReducer from './participants';
import messagesReducer from './messages';

export default combineReducers({
  participants: participantsReducer,
  messages: messagesReducer
});
