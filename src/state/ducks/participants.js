/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';

const PARTICIPANT_JOINED = 'jangouts/participant/JOIN';
const PARTICIPANT_DETACHED = 'jangouts/participant/DETACH';
const PARTICIPANT_STREAM_SET = 'jangouts/participant/SET_STREAM';
const PARTICIPANT_UPDATE_STATUS = 'jangouts/participant/UPDATE_STATUS';

const addParticipant = (participant) => {
  const { id, display, isPublisher, isLocalScreen, isIgnored } = participant;

  return {
    type: PARTICIPANT_JOINED,
    payload: { id, display, isPublisher, isLocalScreen, isIgnored }
  };
};

const removeParticipant = (participantId) => ({
  type: PARTICIPANT_DETACHED,
  payload: participantId
});

const setStream = (participantId) => ({
  type: PARTICIPANT_STREAM_SET,
  payload: participantId
});

const toggleAudio = (id) => {
  return function(_dispatch) {
    janusApi.toggleAudio(id);
  };
};

const updateStatus = (id, status) => ({
  type: PARTICIPANT_UPDATE_STATUS,
  payload: { id, status }
});

const actionCreators = {
  addParticipant,
  removeParticipant,
  setStream,
  toggleAudio,
  updateStatus
};

const actionTypes = {
  PARTICIPANT_JOINED,
  PARTICIPANT_DETACHED,
  PARTICIPANT_STREAM_SET,
  PARTICIPANT_UPDATE_STATUS
};

export const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PARTICIPANT_JOINED: {
      // TODO: check initial values for audio/video
      const participant = { ...payload, audio: true, video: true, stream_timestamp: null };
      return {
        ...state,
        [participant.id]: participant
      };
    }

    case PARTICIPANT_DETACHED: {
      // TODO: use a Map instead of an object to avoid the parseInt call
      return Object.keys(state)
        .filter((key) => parseInt(key) !== payload)
        .reduce((obj, key) => {
          obj[key] = state[key];
          return obj;
        }, {});
    }

    case PARTICIPANT_STREAM_SET: {
      return {
        ...state,
        [payload]: { ...state[payload], stream_timestamp: new Date(Date.now()) }
      };
    }

    case PARTICIPANT_UPDATE_STATUS: {
      const { id, status } = payload;
      return { ...state, [id]: { ...state[id], ...status } };
    }

    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
