/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { classNames } from '../../../utils/common';

function ParticipantActionButton({ icon, label, className, iconStyle, labelStyle, showLabel = false, ...props }) {
  const Icon = icon;

  return(
    <button
      title={label}
      aria-label={label}
      className={classNames(
        "inline-flex items-center focus:outline-none",
        props.disabled && "cursor-default" || "cursor-pointer",
        className
      )}
      {...props}
    >
      <Icon className={classNames("h-auto text-white", iconStyle)} />
      {
        showLabel &&
        <span className={classNames("ml-2 text-left text-xs text-white", labelStyle)}>
          {label}
        </span>
      }
    </button>
  );
}

export default ParticipantActionButton;
