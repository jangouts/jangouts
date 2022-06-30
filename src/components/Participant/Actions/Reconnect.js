/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { RefreshCw } from 'react-feather';
import { actionCreators as participantsActions } from '../../../state/ducks/participants';

import ParticipantActionButton from './ParticipantActionButton';

function Reconnect({ participantId, ...props }) {
  const dispatch = useDispatch();
  const label = 'Restart connection';

  return (
    <ParticipantActionButton
      icon={RefreshCw}
      label={label}
      onClick={() => dispatch(participantsActions.reconnect(participantId))}
      {...props}
    />
  );
}

export default Reconnect;
