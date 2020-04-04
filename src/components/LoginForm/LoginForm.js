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
      {error && <span className="error">{error}</span>}
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
