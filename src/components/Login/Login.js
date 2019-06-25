import React from 'react';
import Logo from '../Logo';
import LoginForm from '../LoginForm';

import './Login.css';

function Login() {
  return (
    <div className="Login">
      <div className="content">
        <Logo />
        <LoginForm />

        <div className="foot-notes">
          <p>
            Tested with recent versions of Firefox, Chrome and Chromium. Please
            review the detailed information about browsers before proceeding.
          </p>
          <hr />
          <p>
            If you wish to use the screen sharing functionality, make sure you
            have understood these instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
