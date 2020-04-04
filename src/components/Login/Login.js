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

function Login() {
  const room = useSelector((state) => state.room);

  if (room.loggedIn) {
    return <Redirect to={`/room/${room.roomId}?user=${room.username}`} />;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-signal">
      <div className="w-5/6 sm:w-2/3 p-5 bg-primary-dark shadow-2xl">
        <Logo className="w-2/3 mx-auto" />

        <LoginForm />

        <div className="mt-4 p-2 text-xs text-center text-gray-100">
          <p>
            Tested with recent versions of Firefox and Chromium. Please review the detailed
            information about browsers before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
