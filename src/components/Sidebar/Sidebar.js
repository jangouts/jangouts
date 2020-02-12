/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Button from '../Button';
import { actionCreators as roomActions } from '../../state/ducks/room';
import { GiExitDoor } from 'react-icons/gi';

import './Sidebar.css';

function Sidebar() {
  return (
    <div className="Sidebar">
      <Button className="red" action={roomActions.logout}>
        <GiExitDoor />
      </Button>
      <Button>·</Button>
      <Button>·</Button>
    </div>
  );
}

export default Sidebar;
