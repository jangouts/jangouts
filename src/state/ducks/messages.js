/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import { createLogEntry } from '../../utils/log-entry'

const MESSAGE_REGISTER = 'jangouts/message/REGISTER';

const send = function(text) {
  return function() {
    janusApi.sendMessage(text);
  };
};

const add = (type, data) => {
  return function(dispatch) {
    const entry = createLogEntry(type, data);
    dispatch(register(entry));
  };
};

const addChatMsg = (feedId, text) => {
  return function(dispatch, getState) {
    const feed = getState().participants[feedId];
    dispatch(add('chatMsg', { feed, text }));
  };
};

const register = (entry) => ({
  type: MESSAGE_REGISTER,
  payload: entry
});

const actionCreators = {
  send,
  add,
  addChatMsg
};

const actionTypes = {
  MESSAGE_REGISTER
};

const initialState = [];

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_REGISTER: {
      const entry = action.payload;
      const { type, timestamp, content } = entry;

      return [...state, { type, timestamp, content, text: entry.text() }];
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
