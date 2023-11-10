/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mic, MicOff } from 'react-feather';
import { actionCreators as participantsActions } from '../../../state/ducks/participants';

import ParticipantActionButton from './ParticipantActionButton';

function ToggleAudio({ participantId, ...props }) {
  const dispatch = useDispatch();
  const participant = useSelector((state) => state.participants[participantId]);
  if (!participant) return null;

  const { display: username, audio, isPublisher } = participant;
  const disabled = !(audio || isPublisher);

  const icon = audio ? Mic : MicOff;
  const label = audio ? 'Mute' : 'Unmute';

  return (
    <ParticipantActionButton
      icon={icon}
      label={disabled ? `${username} is muted` : label}
      data-status={audio ? 'on' : 'off' }
      disabled={disabled}
      onClick={() => dispatch(participantsActions.toggleAudio(participantId))}
      {...props}
    />
  );
}

export default ToggleAudio;

