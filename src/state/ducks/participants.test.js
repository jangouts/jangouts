import reducer, { actionTypes, actionCreators } from './participants';

describe('reducer', () => {
  const initialState = {
    user: { username: 'user' }
  };

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
      payload: { id: 'otherUser', username: 'otherUser' }
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      otherUser: { id: 'otherUser', username: 'otherUser' }
    });
  });

  it('handles PARTICIPANT_DETACHED', () => {
    const action = {
      type: actionTypes.PARTICIPANT_DETACHED,
      payload: { id: 'user', username: 'user' }
    };

    expect(reducer(initialState, action)).toEqual({});
  });
});

describe('action creators', () => {
  describe('#addParticipant', () => {
    it('creates an action to add a participant', () => {
      const participant = { id: 'jangouts', username: 'jangouts' };
      const expectedAction = {
        type: actionTypes.PARTICIPANT_JOINED,
        payload: participant
      };

      expect(actionCreators.addParticipant(participant)).toEqual(
        expectedAction
      );
    });
  });

  describe('#removeParticipant', () => {
    it('creates an action to detach a participant', () => {
      const participant = { id: 'jangouts', username: 'jangouts' };
      const expectedAction = {
        type: actionTypes.PARTICIPANT_DETACHED,
        payload: participant
      };

      expect(actionCreators.removeParticipant(participant)).toEqual(
        expectedAction
      );
    });
  });
});
