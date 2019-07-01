/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';

const ROOM_LOGIN = 'jangouts/room/LOGIN';
const ROOM_LOGOUT = 'jangouts/room/LOGOUT';

const login = (username, roomId) => {
  return function(dispatch) {
    const room = { id: parseInt(roomId) };

    dispatch(loginRequest(room));

    janusApi
      .enterRoom(room, username)
      .then(() => {
        dispatch(loginSuccess({ ...room, username }));
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };
};

const loginRequest = (room) => ({
  type: ROOM_LOGIN,
  payload: { ...room, logingIn: true }
});
const loginSuccess = (room) => ({
  type: ROOM_LOGIN,
  payload: { ...room, logedIn: true }
});
const loginFailure = () => ({ type: ROOM_LOGIN });
const logout = () => ({ type: ROOM_LOGOUT });

const actionCreators = {
  login,
  logout
};

const actionTypes = {
  ROOM_LOGIN,
  ROOM_LOGOUT
};

const initialState = {};

const reducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ROOM_LOGIN: {
      return payload;
    }
    case ROOM_LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
