/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState, useEffect } from 'react';
import janusApi from '../../janus-api';
import { useDispatch, useSelector } from 'react-redux';
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

/**
 * Handles the form submmission.
 *
 * @param {Object} event
 * @param {function} dispatch
 * @param {Object} userInput
 * @param {Object} roomSelector
 * @returns {undefined}
 */
function handleSubmit(event, dispatch, userInput, roomSelector) {
  event.preventDefault();

  const username = userInput.current.value;
  const roomId = roomSelector.current.value;

  // TODO: validate data and give feedback
  dispatch(roomActions.login(username, roomId));
}

function LoginForm() {
  const roomSelector = React.createRef();
  const userInput = React.createRef();
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    janusApi.getRooms().then((r) => setRooms(r));
  }, []);

  return (
    <form
      className="LoginForm"
      onSubmit={(event) => handleSubmit(event, dispatch, userInput, roomSelector)}>
      <div className="form-row">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" ref={userInput} />
      </div>
      <div className="form-row">
        <label htmlFor="room">Room</label>
        <select id="room" name="room" ref={roomSelector}>
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
