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
        "inline-flex items-center",
        className
      )}
      {...props}
    >
      <span className="w-7 md:w-5 p-px text-center">
        <Icon className={classNames("w-full h-auto text-white", iconStyle)} />
      </span>
      {
        showLabel &&
        <span className={classNames("ml-1 text-xs text-white", labelStyle)}>
          {label}
        </span>
      }
    </button>
  );
}

export default ParticipantActionButton;
