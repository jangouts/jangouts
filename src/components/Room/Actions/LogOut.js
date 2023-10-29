/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { LogOut as LogOutIcon } from 'react-feather';
import { actionCreators as roomActions } from '../../../state/ducks/room';

function LogOut({className, iconStyle}) {
  const label = "Leave the room";
  const dispatch = useDispatch();

  return (
    <button
      title={label}
      aria-label={label}
      className={className}
      onClick={() => dispatch(roomActions.logout())}>
      <LogOutIcon className="logout-action"/>
    </button>
  );
}

export default LogOut;
