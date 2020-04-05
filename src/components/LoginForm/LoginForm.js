/**
 * Copyright (c) [2015-2019] SUSE Linux
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
  return rooms.map((r) => (
    <option key={r.id} value={r.id}>
      {r.description}
    </option>
  ));
}

/**
 * Determines whether the select room requires a PIN.
 *
 * @param {Array} rooms - available rooms
 * @param {String,Integer} roomId - roomId
 * @returns {Boolean}
 */
function pinRequired(rooms, roomId) {
  const id = parseInt(roomId);
  const room = rooms.find((r) => r.id === id);
  return room && room.pinRequired;
}

function onSubmit(dispatch) {
  return function(data) {
    dispatch(roomActions.login(data.username, data.room, data.pin));
  };
}

/**
 * Generates the markup to render an alert
 *
 * @param {String} error - the error message
 * @returns {String,undefined} - the HTML markup if error message is defined; undefined otherwise
 */
function renderError(error) {
  if (error) {
    return (
      <div
        className="bg-gray-100 border-b-4 border-secondary text-secondary px-4 py-3 shadow-md shadow-inner"
        role="alert">
        <div className="flex">
          <div className="">
            <svg
              className="fill-current h-6 w-6 text-secondary mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20">
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">{error}</p>
          </div>
        </div>
      </div>
    );
  }
}

function LoginForm() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const previousRoom = useSelector((state) => state.room);
  const { register, handleSubmit, reset, watch } = useForm();
  const selectedRoom = watch('room');
  const { username: previousUsername, error } = previousRoom;

  useEffect(() => {
    janusApi.getRooms().then((rooms) => {
      setRooms(rooms);
      let roomId;
      if (previousRoom.roomId) {
        roomId = previousRoom.roomId;
      } else if (rooms.length > 0) {
        roomId = rooms[0].id;
      }
      reset({ room: roomId });
    });
  }, []);

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit(dispatch))}>
      {renderError(error)}
      <div className="form-element">
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-input"
          defaultValue={previousUsername}
          ref={register}
          autoComplete="username"
          required
        />
      </div>

      <div className="form-element">
        <label className="form-label" htmlFor="room">
          Room
        </label>
        <select className="form-input" id="room" name="room" ref={register} required>
          {roomOptions(rooms)}
        </select>
      </div>

      {pinRequired(rooms, selectedRoom) && (
        <div className="form-element">
          <label className="form-label" htmlFor="pin">
            Pin
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            className="form-input"
            ref={register}
            autoComplete="current-password"
            required
          />
        </div>
      )}

      <div className="mt-4 pt-2 border-t">
        <input className="form-btn hover:text-lg" type="submit" value="Sign in" />
      </div>
    </form>
  );
}

export default LoginForm;
