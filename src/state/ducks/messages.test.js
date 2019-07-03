/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import reducer, { actionTypes, actionCreators } from './messages';

const newMessage = { id: '5678', content: 'See you!', type: 'message' };

describe('reducer', () => {
  const initialState = [{ id: '1234', content: 'Hello!', type: 'message' }];

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: newMessage };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles MESSAGE_SENT', () => {
    const action = { type: actionTypes.MESSAGE_SENT, payload: newMessage };

    expect(reducer(initialState, action)).toEqual([
      ...initialState,
      { id: '5678', content: 'See you!', type: 'message' }
    ]);
  });

  it('handles MESSAGE_RECEIVED', () => {
    const action = { type: actionTypes.MESSAGE_RECEIVED, payload: newMessage };

    expect(reducer(initialState, action)).toEqual([
      ...initialState,
      { id: '5678', content: 'See you!', type: 'message' }
    ]);
  });
});

describe('action creators', () => {
  describe('#send', () => {
    it('sends the message through janusApi', () => {
      janusApi.sendMessage = jest.fn();
      actionCreators.send(newMessage)();
      expect(janusApi.sendMessage).toHaveBeenCalledWith(newMessage);
    });
  });

  describe('#receive', () => {
    it('creates an action to received a message', () => {
      const expectedAction = {
        type: actionTypes.MESSAGE_RECEIVED,
        payload: newMessage
      };

      expect(actionCreators.receive(newMessage)).toEqual(expectedAction);
    });
  });
});
