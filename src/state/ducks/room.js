/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import UserSettings from '../../utils/user-settings';

const ROOM_LOGIN = 'jangouts/room/LOGIN';
const ROOM_LOGIN_REQUEST = 'jangouts/room/LOGIN_REQUEST';
const ROOM_LOGOUT = 'jangouts/room/LOGOUT';
const ROOM_SETTINGS_LOAD = 'jangouts/room/SETTINGS_LOAD';

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
  };
};

const loadSettings = () => {
  const settings = UserSettings.load() || initialSettings();
  return { type: ROOM_SETTINGS_LOAD, payload: { settings: settings.toPlain() } };
};

const saveSettings = (plainSettings) => {
  const settings = UserSettings.fromPlain(plainSettings);
  settings.save();
  return { type: ROOM_SETTINGS_LOAD, payload: { settings: plainSettings } };
};

const actionCreators = {
  login,
  logout,
  loginFailure,
  loadSettings,
  saveSettings
};

const actionTypes = {
  ROOM_LOGIN,
  ROOM_LOGIN_REQUEST,
  ROOM_LOGOUT,
  ROOM_SETTINGS_LOAD
};

const initialSettings = () => {
  let settings = new UserSettings();
  settings.chatOpen = true;
  return settings.toPlain();
};

export const initialState = { settings: initialSettings(), loggedIn: false, loggingIn: false };

const reducer = function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ROOM_LOGIN_REQUEST: {
      return { ...state, ...payload, loggingIn: true };
    }
    case ROOM_LOGIN: {
      if (payload !== undefined && payload.error) {
        return { ...state, loggingIn: false, loggedIn: false, error: payload.error };
      } else {
        return { ...state, loggingIn: false, loggedIn: true };
      }
    }
    case ROOM_SETTINGS_LOAD: {
      return { ...state, settings: payload.settings };
    }
    case ROOM_LOGOUT: {
      return { ...state, loggedIn: false };
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes };

export default reducer;
