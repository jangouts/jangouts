/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { combineReducers } from 'redux';

import roomReducer, { actionCreators as roomActions, initialState as roomInitial } from './room';
import participantsReducer, {
  actionCreators as participantsActions,
  initialState as participantsInitial
} from './participants';
import messagesReducer, {
  actionCreators as messagesActions,
  initialState as messagesInitial
} from './messages';

export const actionCreators = {
  room: roomActions,
  participants: participantsActions,
  messages: messagesActions
};

export const initialState = {
  room: roomInitial,
  participants: participantsInitial,
  messages: messagesInitial
};

export default combineReducers({
  room: roomReducer,
  participants: participantsReducer,
  messages: messagesReducer
});
