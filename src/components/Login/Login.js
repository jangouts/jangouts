import React from 'react';
import Logo from '../Logo';

import './Login.css';

function Login() {
  return (
    <div className="Login">
      <div className="content">
        <Logo />
        <form>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-row">
            <label htmlFor="room">Room</label>
            <select id="room" name="room">
            </select>
          </div>
          <div className="form-row">
            <input type="submit" value="Sign in" />
          </div>
        </form>

        <div className="foot-notes">
          <p>
            Tested with recent versions of Firefox, Chrome and Chromium. Please review the detailed information about browsers before proceeding.
          </p>
          <hr />
          <p>
            If you wish to use the screen sharing functionality, make sure you have understood these instructions.
          </p>
        </div>
      </div>
    </div>
  );

}
export default Login;
