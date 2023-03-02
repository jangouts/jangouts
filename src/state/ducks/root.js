/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { combineReducers } from 'redux';

import roomReducer, {
  actionCreators as roomActions,
  actionTypes as roomActionTypes,
  initialState as roomInitial
} from './room';

import participantsReducer, {
  actionCreators as participantsActions,
  initialState as participantsInitial
} from './participants';

import messagesReducer, {
  actionCreators as messagesActions,
  initialState as messagesInitial
} from './messages';

import configReducer, {
  actionCreators as configActions,
  initialState as configInitial
} from './config';

import notificationsReducer, {
  actionCreators as notificationActions,
  initialState as notificationsInitial
} from './notifications';

/**
 * The combined reducer in charge of handling dispatched actions
 */
const appReducer = combineReducers({
  room: roomReducer,
  participants: participantsReducer,
  messages: messagesReducer,
  config: configReducer,
  notifications: notificationsReducer
});

/**
 * A wrapper reducer which delegates in appReducer after performing additional
 * handling if needed.
 *
 * @see https://stackoverflow.com/a/35641992 for further information
 */
const rootReducer = (state, action) => {
  // If the user is leaving the room, reset the state by re-assigning
  // the reference to the local `state` variable before delegating in
  // the appReducer.
  if (action.type === roomActionTypes.ROOM_LOGOUT) {
    const { config, room } = state;
    state = { config, room };
  }

  return appReducer(state, action);
};

/** @see src/setupTests.js **/
export const initialState = {
  room: roomInitial,
  participants: participantsInitial,
  messages: messagesInitial,
  config: configInitial,
  notifications: notificationsInitial
};

/** @see src/components/App/events-handler.test.js **/
export const actionCreators = {
  room: roomActions,
  participants: participantsActions,
  messages: messagesActions,
  config: configActions,
  notifications: notificationActions
};

export default rootReducer;
