/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';

import logo from './assets/logo.png';

function Logo({ width, alt }) {
  return <img src={logo} width={width || '100%'} alt={alt || 'Jangouts logo'} />;
}

export default Logo;
