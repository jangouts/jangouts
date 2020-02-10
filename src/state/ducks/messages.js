/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';

const MESSAGE_SENT = 'jangouts/message/SEND';
const MESSAGE_RECEIVED = 'jangouts/message/RECEIVE';

const send = function(text) {
  return function() {
    janusApi.sendMessage(text);
  };
};

const receive = (message) => ({
  type: MESSAGE_RECEIVED,
  payload: message
});

const actionCreators = {
  send,
  receive
};

const actionTypes = {
  MESSAGE_SENT,
  MESSAGE_RECEIVED
};

export const initialState = [];

const reducer = function(state = initialState, action) {
  switch (action.type) {
    // TODO: store sent message as "history" too
    case MESSAGE_SENT:
    case MESSAGE_RECEIVED: {
      const message = action.payload;

      // TODO: simplify the message structure
      return [...state, message];
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
