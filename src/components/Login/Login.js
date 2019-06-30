/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import Logo from '../Logo';
import LoginForm from '../LoginForm';

import './Login.css';

function Login() {
  const room = useSelector((state) => state.room);

  if (room.logedIn) {
    return <Redirect to={`/room/${room.id}`} />;
  }

  return (
    <div className="Login">
      <div className="content">
        <Logo />
        <LoginForm />

        <div className="foot-notes">
          <p>
            Tested with recent versions of Firefox, Chrome and Chromium. Please review the detailed
            information about browsers before proceeding.
          </p>
          <hr />
          <p>
            If you wish to use the screen sharing functionality, make sure you have understood these
            instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
