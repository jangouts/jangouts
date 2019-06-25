import React from 'react';

import './LoginForm.css';

function LoginForm() {
  return (
    <form className="LoginForm">
      <div className="form-row">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
      </div>
      <div className="form-row">
        <label htmlFor="room">Room</label>
        <select id="room" name="room"></select>
      </div>
      <div className="form-row">
        <input type="submit" value="Sign in" />
      </div>
    </form>
  );
}

export default LoginForm;
