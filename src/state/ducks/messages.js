const MESSAGE_SENT = 'jangouts/message/SEND';
const MESSAGE_RECEIVED = 'jangouts/message/RECEIVE';

const sendMessage = message => ({
  type: MESSAGE_SENT,
  payload: message
});

const receiveMessage = message => ({
  type: MESSAGE_RECEIVED,
  payload: message
});

const actionCreators = {
  sendMessage,
  receiveMessage
};

const actionTypes = {
  MESSAGE_SENT,
  MESSAGE_RECEIVED
};

const initialState = {};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_SENT:
    case MESSAGE_RECEIVED: {
      const message = action.payload;

      return {
        ...state,
        [message.id]: message
      };
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
