/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Monitor } from 'react-feather';
import { actionCreators as participantActions } from '../../../state/ducks/participants';

function ShareScreen({className, iconStyle}) {
  const label = "Share Screen";
  const dispatch = useDispatch();

  return (
    <button
      title={label}
      aria-label={label}
      className={className}
      onClick={() => dispatch(participantActions.startScreenSharing())}>
      <Monitor className={iconStyle} />
    </button>
  );
}

export default ShareScreen;
