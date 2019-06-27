import reducer, { actionTypes, actionCreators } from './room';

const room = { id: 'misc', name: 'Misc' };

describe('reducer', () => {
  const initialState = {};

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: room };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles ROOM_ENTER', () => {
    const action = { type: actionTypes.ROOM_ENTER, payload: room };

    expect(reducer(initialState, action)).toEqual(room);
  });

  it('handles ROOM_EXIT', () => {
    const action = { type: actionTypes.ROOM_EXIT };

    expect(reducer(initialState, action)).toEqual({});
  });
});

describe('action creators', () => {
  describe('#enterRoom', () => {
    it('creates an action to enter in a room', () => {
      const expectedAction = {
        type: actionTypes.ROOM_ENTER,
        payload: room
      };

      expect(actionCreators.enterRoom(room)).toEqual(expectedAction);
    });
  });

  describe('#exitRoom', () => {
    it('creates an action to exit of a room', () => {
      const expectedAction = { type: actionTypes.ROOM_EXIT };

      expect(actionCreators.exitRoom(room)).toEqual(expectedAction);
    });
  });
});
