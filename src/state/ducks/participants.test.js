/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes, actionCreators } from './participants';
import janusApi from '../../janus-api';

let participant = {
  id: 1234,
  display: undefined,
  isPublisher: undefined,
  isLocalScreen: undefined,
  isIgnored: undefined,
  audio: undefined,
  speakingSince: undefined,
  getVideoEnabled: () => true
};

let initialState = {
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
      5678: { id: 5678, username: 'otherUser', streamTimestamp: null }
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

    expect(updatedParticipant['streamTimestamp']).toEqual(timestamp);
  });

  it('handles PARTICIPANT_UPDATE_STATUS', () => {
    const action = {
      type: actionTypes.PARTICIPANT_UPDATE_STATUS,
      payload: { id: 1234, status: { audio: true, video: false } }
    };

    const state = reducer(initialState, action);
    const participant = state['1234'];
    expect(participant['audio']).toEqual(true);
    expect(participant['video']).toEqual(false);
  });

  it('handles PARTICIPANT_UPDATE_STATUS: audio is false', () => {
    const action = {
      type: actionTypes.PARTICIPANT_UPDATE_STATUS,
      payload: { id: 1234, status: { audio: false, speaking: true } }
    };

    const speakingState = {...initialState, 1234: {...participant, speaking: true }};
    const state = reducer(speakingState, action);
    const updatedParticipant = state['1234'];
    expect(updatedParticipant).toMatchObject({audio: false, speaking: false, speakingSince: null});
  });

  it('handles PARTICIPANT_UPDATE_STATUS: speaking is false', () => {
    const action = {
      type: actionTypes.PARTICIPANT_UPDATE_STATUS,
      payload: { id: 1234, status: { audio: true, speaking: false } }
    };

    const speakingState = {...initialState, 1234: {...participant, audio: true, speaking: false }};
    const state = reducer(speakingState, action);
    const updatedParticipant = state['1234'];
    expect(updatedParticipant).toMatchObject({audio: true, speaking: false, speakingSince: null});
  });

  describe('handles PARTICIPANT_SET_FOCUS', () => {
    it('sets the focus only for the given user', () => {
      initialState = {
        1234: { id: 1234, focus: 'auto' },
        5678: { id: 5678 }
      };
      const action = {
        type: actionTypes.PARTICIPANT_SET_FOCUS,
        payload: { id: 5678, cause: 'user' }
      };
      const state = reducer(initialState, action);
      expect(state['1234'].focus).toBeUndefined();
      expect(state['5678'].focus).toBe('user');
    });
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
      const { id, display, isPublisher, isLocalScreen, isIgnored } = participant;
      expect(action.payload).toEqual({
        id, display, isPublisher, isLocalScreen, isIgnored, video: true
      });
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

  describe('#updateStatus', () => {
    it('creates an action to update the status', () => {
      const action = actionCreators.updateStatus(1234, { video: true });
      expect(action.type).toEqual(actionTypes.PARTICIPANT_UPDATE_STATUS);
    });
  });

  describe.skip('#updateLocalStatus');

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

  describe('#toggleAudio', () => {
    it('returns a function that asks janus to toggle the audio', () => {
      janusApi.toggleAudio = jest.fn();
      const f = actionCreators.toggleAudio(1234);
      f();
      expect(janusApi.toggleAudio).toHaveBeenCalledWith(1234);
    });
  });

  describe('#toggleVideo', () => {
    it('returns a function that asks janus to toggle the audio', () => {
      janusApi.toggleVideo = jest.fn();
      const f = actionCreators.toggleVideo();
      f();
      expect(janusApi.toggleVideo).toHaveBeenCalled();
    });
  });

  describe('#reconnect', () => {
    it('returns a function that asks janus to reconnect to the feed', () => {
      janusApi.reconnectFeed = jest.fn();
      const f = actionCreators.reconnect(1234);
      f();
      expect(janusApi.reconnectFeed).toHaveBeenCalledWith(1234);
    });
  });
});
