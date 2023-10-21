/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Logo from '../Logo';
import LoginForm from '../LoginForm';

function Login() {
  const room = useSelector((state) => state.room);

  if (room.loggedIn) {
    return <Navigate to={`/room/${room.roomId}?user=${room.username}`} />;
  }

  return (
    <div className="full-viewport bg-signal">
      <div className="login-wrapper">
        <Logo />
        <LoginForm />
        <div className="powered-by">
          Powered by <a target="_blank" rel="noreferrer" href="https://github.com/jangouts/jangouts" className="underline">Jangouts</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
