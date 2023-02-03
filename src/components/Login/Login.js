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
    <div className="flex items-center justify-center h-screen w-screen bg-signal">
      <div className="w-5/6 sm:w-2/3 lg:w-1/3 p-5 lg:py-8 bg-primary-dark shadow-2xl">
        <Logo className="w-2/3 mx-auto" />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
