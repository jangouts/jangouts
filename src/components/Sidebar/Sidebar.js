/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Button from '../Button';
import { actionCreators as roomActions } from '../../state/ducks/room';
import { actionCreators as participantActions } from '../../state/ducks/participants';
import { LogOut, Monitor } from 'react-feather';

import './Sidebar.css';

// TODO: Button seems no longer necessary. Use simpler approach
function Sidebar() {
  return (
    <div className="Sidebar">
      <Button className="red" />
      <Button action={participantActions.startScreenSharing}>
        <Monitor />
      </Button>
      <Button action={roomActions.logout}>
        <LogOut />
      </Button>
    </div>
  );
}

export default Sidebar;
