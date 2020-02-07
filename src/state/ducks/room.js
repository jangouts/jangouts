/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';

const ROOM_LOGIN = 'jangouts/room/LOGIN';
const ROOM_LOGOUT = 'jangouts/room/LOGOUT';

const login = (username, room) => {
  return function(dispatch) {
    const roomId = parseInt(room);

    dispatch(loginRequest({ roomId, username }));

    janusApi
      .enterRoom({ id: roomId }, username)
      .then(() => {
        dispatch(loginSuccess({ roomId, username }));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
};

const loginRequest = ({roomId, username}) => ({
  type: ROOM_LOGIN,
  payload: { roomId, username, logingIn: true }
});
const loginSuccess = ({roomId, username}) => ({
  type: ROOM_LOGIN,
  payload: { roomId, username, logedIn: true }
});
const loginFailure = (error) => ({
  type: ROOM_LOGIN,
  payload: { error: error }
});
const logout = () => ({ type: ROOM_LOGOUT });

const actionCreators = {
  login,
  logout,
  loginFailure
};

const actionTypes = {
  ROOM_LOGIN,
  ROOM_LOGOUT
};

export const initialState = {};

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

