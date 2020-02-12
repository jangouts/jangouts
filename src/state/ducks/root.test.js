/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { initialState } from './root';
import { actionTypes as types } from './room';

describe('reducer', () => {
  const currentState = {
    room: {
      id: 'fakeRoomState'
    },
    participants: {
      1: 'fakeParticipant'
    },
    messages: ['fake', 'messages']
  };

  describe(`when action is ${types.ROOM_LOGOUT}`, () => {
    const action = { type: types.ROOM_LOGOUT };

    it('resets the full state', () => {
      expect(reducer(currentState, action)).toEqual(initialState);
    });
  });
});
