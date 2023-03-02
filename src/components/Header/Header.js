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
    <div className="flex items-center justify-between">
      <div className="flex w-2/5">
        <RoomName/>
        <span>{/* N participants? */}</span>
      </div>
      <div className="flex w-1/5 py-1 justify-center">
        <Logo className="h-6 w-auto hidden sm:block" />
      </div>
      <div className="flex gap-1 w-2/5 justify-end">
        {/* General actions */}
        {children}
        <RoomActions className="ml-4 p-px" />
      </div>
    </div>
  );
}

export default Header;
