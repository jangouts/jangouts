/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import { createLogEntry } from '../../utils/log-entry';

const MESSAGE_REGISTER = 'jangouts/message/REGISTER';
const MESSAGE_DISPLAYED = 'jangouts/message/DISPLAYED';

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

const markDisplayed = (index) => ({
  type: MESSAGE_DISPLAYED,
  payload: index
});

const actionCreators = {
  send,
  add,
  addChatMsg,
  markDisplayed
};

const actionTypes = {
  MESSAGE_REGISTER,
  MESSAGE_DISPLAYED
};

const initialState = { displayed: -1, list: [] };

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_REGISTER: {
      const entry = action.payload;
      const { type, timestamp, content } = entry;
      const list = state.list;

      return {...state, list: [...list, { index: list.length, text: entry.text(), type, timestamp, content }]};
    }

    case MESSAGE_DISPLAYED: {
      const index = action.payload;

      if (index === null) {
        return {...state};
      } else {
        return {...state, displayed: Math.max(index, state.displayed) };
      }
    }

    default:
      return state;
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
