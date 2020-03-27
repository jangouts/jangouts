/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';

import Button from '../Button';
import { actionCreators as configActions } from '../../state/ducks/config';
import { actionCreators as roomActions } from '../../state/ducks/room';
import { actionCreators as participantActions } from '../../state/ducks/participants';
import { GiExitDoor } from 'react-icons/gi';
import { MdScreenShare, MdPhoto } from 'react-icons/md';

import './Sidebar.css';

// TODO: Button seems no longer necessary. Use simpler approach
function Sidebar() {
  const thumbnailMode = useSelector((state) => state.config.thumbnailMode);

  return (
    <div className="Sidebar">
      <Button className="red" />
      <Button
        action={configActions.toggleThumbnailMode}
        title={`Turn thumbnail mode ${thumbnailMode ? 'off' : 'on'}`}
        className={thumbnailMode ? 'red' : ''}>
        <MdPhoto />
      </Button>
      <Button title="Share screen" action={participantActions.startScreenSharing}>
        <MdScreenShare />
      </Button>
      <Button title="Log out" action={roomActions.logout}>
        <GiExitDoor />
      </Button>
    </div>
  );
}

export default Sidebar;
