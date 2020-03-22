/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes as types, actionCreators as actions } from './room';

const username = 'jangouts';
const roomId = 5678;

describe('reducer', () => {
  const initialState = {
    thumbnailMode: false
  };

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: {} };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles ROOM_LOGIN', () => {
    const action = {
      type: types.ROOM_LOGIN
    };
    const nextState = {
      ...initialState,
      roomId,
      username: 'me'
    };

    expect(reducer({ roomId, username }, action)).toEqual({
      roomId,
      username,
      loggingIn: false,
      loggedIn: true
      thumbnailMode: false,
    });
  });

  it('handles ROOM_LOGIN_REQUEST', () => {
    const action = {
      type: types.ROOM_LOGIN_REQUEST,
      payload: { roomId, username }
    };

    expect(reducer({ roomId, username }, action)).toEqual({ roomId, username, loggingIn: true });
  });

  it('handles ROOM_LOGOUT', () => {
    const action = { type: types.ROOM_LOGOUT };

    expect(reducer({ roomId, username }, action)).toEqual({ roomId, username, loggedIn: false });
  });

  it('handles ROOM_TOGGLE_THUMBNAIL_MODE', () => {
    const action = {
      type: types.ROOM_TOGGLE_THUMBNAIL_MODE,
      payload: { thumbnailMode: true }
    };

    expect(reducer(initialState, action)).toEqual({ thumbnailMode: true });
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
