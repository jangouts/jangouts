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
const PARTICIPANT_SET_FOCUS = 'jangouts/participant/PARTICIPANT_SET_FOCUS';

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

const participantSpeaking = (id, speaking) => ({
  type: PARTICIPANT_SPEAKING,
  payload: { id, speaking }
});

const autoSetFocus = (force = false) => {
  return function(dispatch, getState) {
    const participants = getState().participants; // TODO: Use a selector
    const { id: oldFocusId, focus } = focusedParticipant(participants) || {};
    if (!force && focus === 'user') return;

    const { id: nextFocusId } = nextFocusedParticipant(participants) || {};

    const focusId = nextFocusId || oldFocusId || localParticipant(participants).id;
    dispatch(setFocus(focusId, 'auto'));
  };
};

const setFocus = (id, cause = 'user') => ({
  type: PARTICIPANT_SET_FOCUS,
  payload: { id, cause }
});

const unsetFocus = () => autoSetFocus(true);

/**
 * Local participant
 */
const localParticipant = (state) =>
  Object.values(state).find((p) => p.isPublisher && !p.isLocalScreen);

/**
 * Selects the focused participant from the state
 *
 * It returns the participant who is marked as `focus`.
 */
const focusedParticipant = (state) => {
  const participants = Object.values(state);
  return participants.find((p) => p.focus);
};

/**
 * Selects the next participant to focus on
 *
 * This function does not check the `focus` attribute. Instead,
 * it tries to find out who is the next participant to focus on.
 */
const nextFocusedParticipant = (state) => {
  const participants = Object.values(state);
  const [speaker] = Object.values(participants)
    .filter((p) => p.speaking)
    .sort((a, b) => a.speakingChange - b.speakingChange);

  return speaker;
};

const actionCreators = {
  addParticipant,
  removeParticipant,
  setStream,
  toggleAudio,
  updateStatus,
  updateLocalStatus,
  participantSpeaking,
  setFocus,
  unsetFocus,
  autoSetFocus
};

const actionTypes = {
  PARTICIPANT_JOINED,
  PARTICIPANT_DETACHED,
  PARTICIPANT_STREAM_SET,
  PARTICIPANT_UPDATE_STATUS,
  PARTICIPANT_UPDATE_LOCAL_STATUS,
  PARTICIPANT_SPEAKING,
  PARTICIPANT_SET_FOCUS
};

const selectors = {
  localParticipant,
  focusedParticipant
};

export const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PARTICIPANT_JOINED: {
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
      const newState = { ...state, [id]: { ...state[id], ...status } };
      if (!newState[id].audio) newState[id].speaking = false;
      return newState;
    }

    case PARTICIPANT_UPDATE_LOCAL_STATUS: {
      const id = localParticipant(state).id;
      const { audio, video } = payload;
      const newState = { ...state, [id]: { ...state[id], audio, video } };
      if (!audio) newState.speaking = false;
      return newState;
    }

    case PARTICIPANT_SPEAKING: {
      const { id, speaking } = payload;
      return { ...state, [id]: { ...state[id], speaking, speakingChange: Date.now() } };
    }

    case PARTICIPANT_SET_FOCUS: {
      const { id, cause } = payload;
      const oldFocus = Object.values(state).find((p) => p.focus);
      const newState = { ...state, [id]: { ...state[id], focus: cause } };
      if (oldFocus && oldFocus.id !== id) {
        delete newState[oldFocus.id].focus;
      }
      return newState;
    }

    default:
      return state;
  }
};

export { actionCreators, actionTypes, selectors };

export default reducer;
