/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';

import Logo from '../Logo';

import './Header.css';

function Header() {
  return (
    <div className="Header">
      <Logo width="150" />
    </div>
  );
}

export default Header;
