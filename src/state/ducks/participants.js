const PARTICIPANT_JOINED = 'jangouts/participant/JOIN';
const PARTICIPANT_DETACHED = 'jangouts/participant/DETACH';
const PARTICIPANT_STREAM_SET = 'jangouts/participant/SET_STREAM';

const addParticipant = participant => {
  const { id, display, isPublisher, isLocalScreen, isIgnored } = participant;

  return {
    type: PARTICIPANT_JOINED,
    payload: { id, display, isPublisher, isLocalScreen, isIgnored }
  };
};

const removeParticipant = participantId => ({
  type: PARTICIPANT_DETACHED,
  payload: participantId
});

const setStream = (participantId) => ({
  type: PARTICIPANT_STREAM_SET,
  payload: participantId
});

const actionCreators = {
  addParticipant,
  removeParticipant,
  setStream
};

const actionTypes = {
  PARTICIPANT_JOINED,
  PARTICIPANT_DETACHED,
  PARTICIPANT_STREAM_SET
};

const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PARTICIPANT_JOINED: {
      const participant = {...payload, stream_timestamp: null };
      return {
        ...state,
        [participant.id]: participant
      };
    }

    case PARTICIPANT_DETACHED: {
      // TODO: use a Map instead of an object to avoid the parseInt call
      return Object.keys(state)
        .filter(key => parseInt(key) !== payload)
        .reduce((obj, key) => {
          obj[key] = state[key];
          return obj;
        }, {});
    }

    case PARTICIPANT_STREAM_SET: {
      const participant = {...payload, stream_timestamp: new Date()};
      return {
        ...state,
        [participant.id]: participant
      };
    }

    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
