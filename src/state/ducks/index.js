/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { combineReducers } from 'redux';

import roomReducer, { actionCreators as roomActions } from './room';
import participantsReducer, { actionCreators as participantsActions } from './participants';
import messagesReducer, { actionCreators as messagesActions } from './messages';

export const actionCreators = {
  room: roomActions,
  participants: participantsActions,
  messages: messagesActions
};

export default combineReducers({
  room: roomReducer,
  participants: participantsReducer,
  messages: messagesReducer
});
