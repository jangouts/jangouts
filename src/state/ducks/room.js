/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import history from '../../utils/history';

const ROOM_LOGIN = 'jangouts/room/LOGIN';
const ROOM_LOGIN_REQUEST = 'jangouts/room/LOGIN_REQUEST';
const ROOM_LOGOUT = 'jangouts/room/LOGOUT';

const login = (username, room, pin = undefined) => {
  return function(dispatch) {
    const roomId = parseInt(room);

    dispatch(loginRequest({ roomId, username, pin }));

    janusApi
      .enterRoom({ id: roomId }, username, pin)
      .then(() => {
        dispatch(loginSuccess({ roomId, username }));
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
};

const loginRequest = ({ roomId, username }) => ({
  type: ROOM_LOGIN_REQUEST,
  payload: { roomId, username }
});

const loginSuccess = ({ roomId, username }) => ({
  type: ROOM_LOGIN
});

const loginFailure = (error) => ({
  type: ROOM_LOGIN,
  payload: { error: error }
});

const logout = () => {
  return function(dispatch) {
    janusApi.leaveRoom();

    dispatch({ type: ROOM_LOGOUT });

    history.push('/');
  };
};

const actionCreators = {
  login,
  logout,
  loginFailure
};

const actionTypes = {
  ROOM_LOGIN,
  ROOM_LOGIN_REQUEST,
  ROOM_LOGOUT
};

const initialState = { loggedIn: false, loggingIn: false, thumbnailMode: false };

const reducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ROOM_LOGIN_REQUEST: {
      return { ...payload, loggingIn: true };
    }
    case ROOM_LOGIN: {
      if (payload !== undefined && payload.error) {
        return { ...state, loggingIn: false, loggedIn: false, error: payload.error };
      } else {
        return { ...state, loggingIn: false, loggedIn: true };
      }
    }
    case ROOM_LOGOUT: {
      return { ...state, loggedIn: false };
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
