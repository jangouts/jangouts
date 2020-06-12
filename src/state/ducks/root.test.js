/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer from './root';
import { actionTypes as types } from './room';

describe('reducer', () => {
  const currentState = {
    config: {
      url: 'http://jangouts.io/'
    },
    room: {
      roomId: 'fakeRoom',
      username: 'fakeUser'
    },
    participants: {
      1: 'fakeParticipant'
    },
    messages: ['fake', 'messages'],
    notifications: []
  };

  describe(`when action is ${types.ROOM_LOGOUT}`, () => {
    const action = { type: types.ROOM_LOGOUT };

    it('resets the full state except the configuration', () => {
      expect(reducer(currentState, action)).toEqual({
        config: currentState.config,
        messages: [],
        notifications: { notifications: [], blocklist: [] },
        participants: {},
        room: { ...currentState.room, loggedIn: false }
      });
    });
  });
});
