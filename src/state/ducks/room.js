const ROOM_ENTER = 'jangouts/room/ENTER';
const ROOM_EXIT = 'jangouts/room/EXIT';

const enterRoom = room => ({ type: ROOM_ENTER, payload: room });
const exitRoom = room => ({ type: ROOM_EXIT });

const actionCreators = {
  enterRoom,
  exitRoom
};

const actionTypes = {
  ROOM_ENTER,
  ROOM_EXIT
};

const initialState = {};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case ROOM_ENTER: {
      return action.payload;
    }
    case ROOM_EXIT: {
      return initialState;
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
