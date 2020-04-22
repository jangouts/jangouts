/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch } from 'react-redux';
import { Monitor } from 'react-feather';

function StopScreenSharing({ id }) {
  const dispatch = useDispatch();
  const label = 'Stop Screen Sharing';

  return (
    <button
      title={label}
      aria-label={label}
      onClick={() => dispatch(participantsActions.stopScreenSharing(id))}>
      <Monitor />
    </button>
  );
}

export default StopScreenSharing;
