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
import { classNames } from '../../../utils/common';

import ParticipantActionButton from './ParticipantActionButton';

function ToggleAudio({ participantId, iconStyle, ...props }) {
  const dispatch = useDispatch();
  const participant = useSelector((state) => state.participants[participantId]);
  if (!participant) return null;

  const { display: username, audio, isPublisher } = participant;
  const disabled = !(audio || isPublisher);

  const icon = audio ? Mic : MicOff;
  const label = audio ? 'Mute' : 'Unmute';
  const enableClassNames = audio ? "text-green-600" : "text-red-600";
  const disableClassNames = "text-gray-800";

  return (
    <ParticipantActionButton
      icon={icon}
      label={disabled ? `${username} is muted` : label}
      disabled={disabled}
      iconStyle={classNames(
        disabled ? disableClassNames : enableClassNames,
        iconStyle
      )}
      onClick={() => dispatch(participantsActions.toggleAudio(participantId))}
      {...props}
    />
  );
}

export default ToggleAudio;

