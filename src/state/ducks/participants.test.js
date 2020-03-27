/**
 * Copyright (c) [2015-2020] SUSE Linux
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
  video: undefined,
  speakingSince: undefined,
  picture: 'fake;base64;picture;data'
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

  describe('handles PARTICIPANT_UPDATE_STATUS', () => {
    it('updates the participant status', () => {
      const picture = 'updated;picture;data';
      const action = {
        type: actionTypes.PARTICIPANT_UPDATE_STATUS,
        payload: { id: 1234, status: { audio: false, video: false, picture: picture } }
      };

      const state = reducer(initialState, action);
      const participant = state['1234'];
      expect(participant['audio']).toEqual(false);
      expect(participant['video']).toEqual(false);
      expect(participant['picture']).toEqual(picture);
    });

    it('does not override the participant status with undefined or null values', () => {
      const action = {
        type: actionTypes.PARTICIPANT_UPDATE_STATUS,
        payload: { id: 1234, status: { audio: false, video: null, picture: undefined } }
      };

      const state = reducer(initialState, action);
      const participant = state['1234'];
      expect(participant['audio']).toEqual(false);
      expect(participant['video']).not.toEqual(null);
      expect(participant['picture']).not.toEqual(undefined);
    });
  });

  it('handles PARTICIPANT_LOCAL_UPDATE_STATUS', () => {
    const initialState = {
      1234: { id: 1234, isPublisher: true, isLocalScreen: false },
      5678: { id: 5678, isPublisher: false }
    };
    const action = {
      type: actionTypes.PARTICIPANT_UPDATE_LOCAL_STATUS,
      payload: { audio: false, video: false }
    };

    const state = reducer(initialState, action);
    const participant = state['1234'];
    expect(participant['audio']).toEqual(false);
    expect(participant['video']).toEqual(false);
  });

  describe('handles PARTICIPANT_SPEAKING', () => {
    it('sets the speakingChange timestamp when the user is speaking', () => {
      const action = {
        type: actionTypes.PARTICIPANT_SPEAKING,
        payload: { id: 1234, speaking: true }
      };
      const state = reducer(initialState, action);
      const participant = state['1234'];
      expect(typeof participant.speakingChange).toBe('number');
      expect(participant.speaking).toBe(true);
    });

    it('sets the speakingChange timestamp when the user is not speaking', () => {
      const action = {
        type: actionTypes.PARTICIPANT_SPEAKING,
        payload: { id: 1234, speaking: false }
      };
      const state = reducer(initialState, action);
      const participant = state['1234'];
      expect(typeof participant.speakingChange).toBe('number');
      expect(participant.speaking).toBe(false);
    });
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
    const newParticipant = { ...participant, notExpectedKey: true };
    const action = actionCreators.addParticipant(newParticipant);

    it('creates an action to add a participant', () => {
      expect(action.type).toEqual(actionTypes.PARTICIPANT_JOINED);
    });

    it('includes the participant "id" in the action payload', () => {
      expect(action.payload).toHaveProperty('id');
    });

    it('includes the participant "display" in the action payload', () => {
      expect(action.payload).toHaveProperty('id');
    });

    it('includes the participant "isPublisher" in the action payload', () => {
      expect(action.payload).toHaveProperty('isPublisher');
    });

    it('includes the participant "isLocalScreen" in the action payload', () => {
      expect(action.payload).toHaveProperty('isLocalScreen');
    });

    it('includes the participant "isIgnored" in the action payload', () => {
      expect(action.payload).toHaveProperty('isIgnored');
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
