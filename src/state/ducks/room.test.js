import reducer, { actionTypes as types, actionCreators as actions } from './room';

const username = 'jangouts';
const room = { id: 'misc', name: 'Misc' };

describe('reducer', () => {
  const initialState = {};

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: room };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles ROOM_LOGIN', () => {
    const action = { type: types.ROOM_LOGIN, payload: room };

    expect(reducer(initialState, action)).toEqual(room);
  });

  it('handles ROOM_LOGOUT', () => {
    const action = { type: types.ROOM_LOGOUT };

    expect(reducer(initialState, action)).toEqual(initialState);
  });
});

describe('action creators', () => {
  describe.skip('#login', () => {
    it('creates an action to enter in a room', () => {});
  });

  describe('#logout', () => {
    it('creates an action to exit of a room', () => {
      const expectedAction = { type: types.ROOM_LOGOUT };

      expect(actions.logout(room)).toEqual(expectedAction);
    });
  });
});
