import React from 'react';

import logo from '../../assets/logo.png';

function Logo({ width, alt }) {
  return(
    <img
      src={logo}
      width={width || "100%"}
      alt={alt || "Jangouts logo"}
    />
  )
}

export default Logo
