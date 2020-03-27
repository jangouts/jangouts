/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import janusApi from '../../janus-api';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../../state/ducks/room';
import './LoginForm.css';

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

function onSubmit(dispatch) {
  return function(data) {
    dispatch(roomActions.login(data.username, data.room));
  };
}

function LoginForm() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    janusApi.getRooms().then((r) => setRooms(r));
  }, []);

  return (
    <form className="LoginForm" onSubmit={handleSubmit(onSubmit(dispatch))}>
      <div className="form-row">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" ref={register} required />
      </div>
      <div className="form-row">
        <label htmlFor="room">Room</label>
        <select id="room" name="room" ref={register} required>
          {roomOptions(rooms)}
        </select>
      </div>
      <div className="form-row">
        <input type="submit" value="Sign in" />
      </div>
    </form>
  );
}

export default LoginForm;
