const PARTICIPANT_JOINED = 'jangouts/participant/JOIN';
const PARTICIPANT_DETACHED = 'jangouts/participant/DETACH';

const addParticipant = participant => ({
  type: PARTICIPANT_JOINED,
  payload: participant
});

const removeParticipant = participant => ({
  type: PARTICIPANT_DETACHED,
  payload: participant
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
  switch (action.type) {
    case PARTICIPANT_JOINED: {
      const participant = action.payload;

      return {
        ...state,
        [participant.id]: participant
      };
    }

    case PARTICIPANT_DETACHED: {
      return Object.keys(state)
        .filter(key => key !== action.payload.id)
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
