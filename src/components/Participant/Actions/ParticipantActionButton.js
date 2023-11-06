/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';

function ParticipantActionButton({ icon, label, className, showLabel = false, ...props }) {
  const Icon = icon;

  return(
    <button
      title={label}
      aria-label={label}
      className={className}
      {...props}
    >
      <Icon />
      { showLabel && <span>{label}</span> }
    </button>
  );
}

export default ParticipantActionButton;
