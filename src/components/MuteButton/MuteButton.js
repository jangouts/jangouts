/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch, useSelector } from 'react-redux';
import { Mic, MicOff } from 'react-feather';

function MuteButton({ participantId }) {
  const dispatch = useDispatch();
  const participant = useSelector((state) => state.participants[participantId]);
  if (!participant) return null;

  const { audio, isPublisher, speaking } = participant;
  const disabled = !(audio || isPublisher);

  const Icon = audio ? Mic : MicOff;
  const label = audio ? 'Mute' : 'Unmute';

  return (
    <button
      title={label}
      aria-label={label}
      disabled={disabled}
      className={speaking ? 'flashing' : undefined}
      onClick={() => dispatch(participantsActions.toggleAudio(participantId))}>
      <Icon />
    </button>
  );
}

export default MuteButton;
