/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes, actionCreators } from './participants';

const participant = {
  id: 1234,
  display: undefined,
  isPublisher: undefined,
  isLocalScreen: undefined,
  isIgnored: undefined
};

const initialState = {
  1234: participant
};

describe('reducer', () => {
  it('does not handle unknown action', () => {
    const action = {
      type: 'UNKNOWN',
      payload: { id: 'otherUser', username: 'otherUser' }
    };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles PARTICIPANT_JOINED', () => {
    const action = {
      type: actionTypes.PARTICIPANT_JOINED,
      payload: { id: 5678, username: 'otherUser' }
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      5678: { id: 5678, username: 'otherUser', stream_timestamp: null }
    });
  });

  it('handles PARTICIPANT_DETACHED', () => {
    const action = {
      type: actionTypes.PARTICIPANT_DETACHED,
      payload: 1234
    };

    expect(reducer(initialState, action)).toEqual({});
  });

  it('handles PARTICIPANT_STREAM_SET', () => {
    const timestamp = new Date('2019-06-28T08:00:00.000Z');
    const action = {
      type: actionTypes.PARTICIPANT_STREAM_SET,
      payload: 1234
    };
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => timestamp);

    const updatedParticipant = reducer(initialState, action)['1234'];

    expect(updatedParticipant['stream_timestamp']).toEqual(timestamp);
  });
});

describe('action creators', () => {
  describe('#addParticipant', () => {
    it('creates an action to add a participant', () => {
      const newParticipant = { ...participant, notExpectedKey: true };

      const action = actionCreators.addParticipant(newParticipant);
      expect(action.type).toEqual(actionTypes.PARTICIPANT_JOINED);
    });

    it('includes the participant in the action payload', () => {
      const newParticipant = { ...participant, notExpectedKey: true };

      const action = actionCreators.addParticipant(newParticipant);
      expect(action.payload).toEqual(participant);
    });
  });

  describe('#removeParticipant', () => {
    it('creates an action to remove a participant', () => {
      const newParticipant = { ...participant, notExpectedKey: true };

      const action = actionCreators.removeParticipant(newParticipant);
      expect(action.type).toEqual(actionTypes.PARTICIPANT_DETACHED);
    });

    it('includes the participant id in the action payload', () => {
      const action = actionCreators.removeParticipant(participant.id);
      expect(action.payload).toEqual(participant.id);
    });
  });

  describe('#setStream', () => {
    it('creates an action to set/update the participant stream', () => {
      const action = actionCreators.setStream(participant);
      expect(action.type).toEqual(actionTypes.PARTICIPANT_STREAM_SET);
    });

    it('includes the participant id in the action payload', () => {
      const action = actionCreators.setStream(participant.id);
      expect(action.payload).toEqual(participant.id);
    });
  });
});
