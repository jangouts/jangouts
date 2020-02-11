/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch, useSelector } from 'react-redux';

// import './ParticipantButton.css';
import { GoMute, GoUnmute } from 'react-icons/go';

function MuteButton({ participantId }) {
  const dispatch = useDispatch();
  const { audio, isPublisher } = useSelector((state) => state.participants[participantId]);
  const disabled = !(audio || isPublisher);

  const Icon = audio ? GoUnmute : GoMute;
  const label = audio ? 'Mute' : 'Unmute';

  return (
    <button
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={() => dispatch(participantsActions.toggleAudio(participantId))}>
      <Icon />
    </button>
  );
}

export default MuteButton;
