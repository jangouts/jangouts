/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes as types, actionCreators as actions } from './room';

const username = 'jangouts';
const roomId = 5678;
const room = { id: roomId, name: 'Misc' };

describe('reducer', () => {
  const initialState = {};

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: {} };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles ROOM_LOGIN', () => {
    const action = {
      type: types.ROOM_LOGIN,
      payload: { roomId, username: 'me' }
    };

    expect(reducer(initialState, action)).toEqual(action.payload);
  });

  it('handles ROOM_LOGOUT', () => {
    const action = { type: types.ROOM_LOGOUT };

    expect(reducer(initialState, action)).toEqual(initialState);
  });
});

describe('action creators', () => {
  describe.skip('#login', () => {
    it('creates an action to enter in a room', () => {});
  });

  describe('#logout', () => {
    it('creates an action to exit of a room', () => {});
  });
});
