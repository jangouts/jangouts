import janusApi from '../../janus-api';

const MESSAGE_SENT = 'jangouts/message/SEND';
const MESSAGE_RECEIVED = 'jangouts/message/RECEIVE';

const send = function(text) {
  return function() {
    janusApi.sendMessage(text);
  };
};

const receive = message => ({
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

const initialState = [];

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_SENT:
    case MESSAGE_RECEIVED: {
      const message = action.payload;

      return [...state, message];
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
