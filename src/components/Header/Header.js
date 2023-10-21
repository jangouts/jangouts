/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Logo from '../Logo';
import RoomActions from '../Room/RoomActions.js';
import RoomName from '../Room/RoomName';

function Header({ children }) {
  return (
    <div className="header">
      <div>
        <RoomName/>
        <span>{/* N participants? */}</span>
      </div>
      <Logo className="logo"/>
      <div className="actions">
        {/* General actions */}
        {children}
        <RoomActions />
      </div>
    </div>
  );
}

export default Header;
