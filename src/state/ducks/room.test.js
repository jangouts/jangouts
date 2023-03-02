/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes as types } from './room';
import UserSettings from "../../utils/user-settings";

const username = 'jangouts';
const roomId = 5678;

describe('reducer', () => {
  const initialState = {};

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: {} };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles ROOM_LOGIN', () => {
    const action = {
      type: types.ROOM_LOGIN
    };

    expect(reducer({ roomId, username }, action)).toEqual({
      roomId,
      username,
      loggingIn: false,
      loggedIn: true,
      error: null
    });
  });

  it('handles ROOM_LOGOUT', () => {
    const action = { type: types.ROOM_LOGOUT };

    expect(reducer({ roomId, username }, action)).toEqual({ roomId, username, loggedIn: false });
  });
});

it('handles ROOM_LOGIN_REQUEST', () => {
  const action = {
    type: types.ROOM_LOGIN_REQUEST,
    payload: { roomId, username }
  };

  expect(reducer({ roomId, username }, action)).toEqual({ roomId, username, loggingIn: true });
});

it('handles ROOM_SETTINGS_LOAD', () => {
  const settings = new UserSettings();
  settings.username = "test";

  const action = {
    type: types.ROOM_SETTINGS_LOAD,
    payload: { settings }
  };

  expect(reducer({ roomId, username }, action)).toEqual({ roomId, username, settings });
});

describe('action creators', () => {
  describe.skip('#login', () => {
    it('creates an action to enter in a room', () => {});
  });

  describe('#logout', () => {
    it('creates an action to exit of a room', () => {});
  });
});
