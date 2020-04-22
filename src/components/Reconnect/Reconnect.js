/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch } from 'react-redux';
import { RefreshCw } from 'react-feather';

function Reconnect({ participantId }) {
  const dispatch = useDispatch();
  const label = 'Restart connection';

  return (
    <button
      title={label}
      aria-label={label}
      onClick={() => dispatch(participantsActions.reconnect(participantId))}>
      <RefreshCw />
    </button>
  );
}

export default Reconnect;
