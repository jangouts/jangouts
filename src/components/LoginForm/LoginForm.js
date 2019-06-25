import React, { useState, useEffect } from 'react';
import janusApi from '../../janus-api';
import './LoginForm.css';

function roomOptions(rooms) {
  return rooms.map((r) => (
    <option key={r.id} value={r.id}>{r.description}</option>
  ));
}

function LoginForm() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    janusApi.getRooms().then((r) => setRooms(r));
  }, []);

  return (
    <form className="LoginForm">
      <div className="form-row">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
      </div>
      <div className="form-row">
        <label htmlFor="room">Room</label>
        <select id="room" name="room">
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
