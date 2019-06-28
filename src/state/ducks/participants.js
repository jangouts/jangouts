const PARTICIPANT_JOINED = 'jangouts/participant/JOIN';
const PARTICIPANT_DETACHED = 'jangouts/participant/DETACH';

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

const actionCreators = {
  addParticipant,
  removeParticipant
};

const actionTypes = {
  PARTICIPANT_JOINED,
  PARTICIPANT_DETACHED
};

const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PARTICIPANT_JOINED: {
      const participant = payload;

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
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
