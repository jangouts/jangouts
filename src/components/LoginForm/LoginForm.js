/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import janusApi from '../../janus-api';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../../state/ducks/room';

/**
 * Build options for the selector of rooms.
 *
 * @param {Array} rooms - available rooms
 * @returns {Array}
 */
function roomOptions(rooms) {
  const availableRooms = rooms.sort((a, b) => a.description > b.description ? 1 : -1);

  return availableRooms.map((r) => (
    <option key={r.id} value={r.id}>
      {r.description} ({r.participants}/{r.publishers} users)
    </option>
  ));
}

/**
 * Return the requested room
 *
 * @param {Array} rooms - available rooms
 * @param {(String|Integer)} roomId - roomId
 * @returns {Boolean}
 */
function findRoom(rooms, roomId) {
  const id = parseInt(roomId);
  const room = rooms.find((r) => r.id === id);
  return room || {};
}

/**
 * Handles the form submit
 *
 * @param {Function} dispatch - the dispatch function available in the Redux store
 * @param {Object} settings
 * @returns {Function}
 */
function onSubmit(dispatch, settings) {
  return function(data) {
    const newSettings = { ...settings, username: data.username, roomId: data.room };
    dispatch(roomActions.saveSettings(newSettings));
    dispatch(roomActions.login(data.username, data.room, data.pin));
  };
}

/**
 * Generates the markup to render an alert
 *
 * @param {String} error - the error message
 * @returns {String} - the HTML markup
 */
function renderError(error) {
  return (
    <div role="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
      </svg>
      <p>{error}</p>
    </div>
  );
}

function LoginForm() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});
  const { register, handleSubmit, reset } = useForm();
  const { settings, error } = useSelector((state) => state.room);

  useEffect(() => {
    janusApi.getRooms().then(setRooms);
  }, []);

  useEffect(() => {
    const roomId = settings.roomId || rooms[0]?.id;
    reset({ room: roomId });
    setSelectedRoom(findRoom(rooms, roomId));
  }, [settings, rooms]);

  return (
    <form onSubmit={handleSubmit(onSubmit(dispatch, settings))}>
      {error && renderError(error)}
      <div className="form-element">
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          ref={register}
          className="form-input"
          defaultValue={settings.username}
          autoComplete="username"
          required
        />
      </div>

      <div className="form-element">
        <label className="form-label" htmlFor="room">
          Room
        </label>
        <select
          id="room"
          name="room"
          ref={register}
          className="form-input"
          onChange={(e) => setSelectedRoom(findRoom(rooms, e.target.value))}
          required>
          {roomOptions(rooms)}
        </select>
      </div>
      {selectedRoom.pinRequired && (
        <div className="form-element">
          <label className="form-label" htmlFor="pin">
            PIN
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            ref={register}
            className="form-input"
            autoComplete="current-password"
            required
          />
        </div>
      )}
      <input type="submit" value="Enter" />
    </form>
  );
}

export default LoginForm;
