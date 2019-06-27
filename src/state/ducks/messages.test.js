import reducer, { actionTypes, actionCreators } from './messages';

const newMessage = { id: '5678', content: 'See you!', type: 'message' };

describe('reducer', () => {
  const initialState = {
    '1234': { id: '1234', content: 'Hello!', type: 'message' }
  };

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: newMessage };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles MESSAGE_SENT', () => {
    const action = { type: actionTypes.MESSAGE_SENT, payload: newMessage };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      '5678': { id: '5678', content: 'See you!', type: 'message' }
    });
  });

  it('handles MESSAGE_RECEIVED', () => {
    const action = { type: actionTypes.MESSAGE_RECEIVED, payload: newMessage };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      '5678': { id: '5678', content: 'See you!', type: 'message' }
    });
  });
});

describe('action creators', () => {
  describe('#sendMessage', () => {
    it('creates an action to send a message', () => {
      const expectedAction = {
        type: actionTypes.MESSAGE_SENT,
        payload: newMessage
      };

      expect(actionCreators.sendMessage(newMessage)).toEqual(expectedAction);
    });
  });

  describe('#receiveMessage', () => {
    it('creates an action to received a message', () => {
      const expectedAction = {
        type: actionTypes.MESSAGE_RECEIVED,
        payload: newMessage
      };

      expect(actionCreators.receiveMessage(newMessage)).toEqual(expectedAction);
    });
  });
});
