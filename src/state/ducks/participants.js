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
const PARTICIPANT_UPDATE_LOCAL_STATUS = 'jangouts/participant/UPDATE_LOCAL_STATUS';
const PARTICIPANT_SPEAKING = 'jangouts/participant/PARTICIPANT_SPEAKING';

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
  return function() {
    janusApi.toggleAudio(id);
  };
};

const updateStatus = (id, status) => ({
  type: PARTICIPANT_UPDATE_STATUS,
  payload: { id, status }
});

const updateLocalStatus = ({ audio, video }) => ({
  type: PARTICIPANT_UPDATE_LOCAL_STATUS,
  payload: { audio, video }
});

const speaking = (id, speaking) => ({
  type: PARTICIPANT_SPEAKING,
  payload: { id, speaking }
});

const localParticipant = (state) =>
  Object.values(state).find((p) => p.isPublisher && !p.isLocalScreen);

const actionCreators = {
  addParticipant,
  removeParticipant,
  setStream,
  toggleAudio,
  updateStatus,
  updateLocalStatus,
  speaking
};

const actionTypes = {
  PARTICIPANT_JOINED,
  PARTICIPANT_DETACHED,
  PARTICIPANT_STREAM_SET,
  PARTICIPANT_UPDATE_STATUS,
  PARTICIPANT_UPDATE_LOCAL_STATUS,
  PARTICIPANT_SPEAKING
};

export const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PARTICIPANT_JOINED: {
      // TODO: check initial values for audio/video
      const participant = { ...payload, stream_timestamp: null };
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

    case PARTICIPANT_UPDATE_LOCAL_STATUS: {
      const id = localParticipant(state).id;
      const { audio, video } = payload;

      return { ...state, [id]: { ...state[id], audio, video } };
    }

    case PARTICIPANT_SPEAKING: {
      const { id, speaking } = payload;
      const speakingSince = speaking ? new Date(Date.now()) : null;

      return { ...state, [id]: { ...state[id], speakingSince: speakingSince } };
    }

    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
