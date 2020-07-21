/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import reducer, { actionTypes, actionCreators } from './messages';
import { createLogEntry } from '../../utils/log-entry'
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const newMessage = { feed: '5678', text: 'See you!' };
const newEntry = createLogEntry('chatMsg', newMessage);

describe('reducer', () => {
  const initialState = [{ id: '1234', content: 'Hello!', type: 'message' }];

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: newMessage };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles MESSAGE_REGISTER', () => {
    const action = { type: actionTypes.MESSAGE_REGISTER, payload: newEntry };

    expect(reducer(initialState, action)).toEqual([
      ...initialState,
      expect.objectContaining({text: newEntry.text(), content: newMessage})
    ]);
  });
});

describe('action creators', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe('#send', () => {
    it('sends the message through janusApi', () => {
      janusApi.sendMessage = jest.fn();
      actionCreators.send(newMessage)();
      expect(janusApi.sendMessage).toHaveBeenCalledWith(newMessage);
    });
  });

  describe('#add', () => {
    const store = mockStore({});

    it('creates an action to store the new message', () => {
      store.dispatch(actionCreators.add('chatMsg', newMessage));

      const actions = store.getActions();
      expect(actions[0].type).toEqual(actionTypes.MESSAGE_REGISTER);
      expect(actions[0].payload).toMatchObject({type: newEntry.type, content: newEntry.content });
    });
  });
});
