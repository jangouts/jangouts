/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Video, VideoOff } from 'react-feather';
import { actionCreators as participantsActions } from '../../../state/ducks/participants';
import { classNames } from '../../../utils/common';

import ParticipantActionButton from './ParticipantActionButton'

function ToggleVideo({ video, disabled, ...props }) {
  const dispatch = useDispatch();
  const icon = video ? Video : VideoOff;
  const label = video ? 'Switch Video Off' : 'Switch Video On';

  return (
    <ParticipantActionButton
      icon={icon}
      label={label}
      disabled={disabled}
      iconStyle={classNames(
        video ? "text-green-600" : "text-red-600",
        props.iconStyle
      )}
      onClick={() => dispatch(participantsActions.toggleVideo())}
      {...props}
    />
  );
}

export default ToggleVideo;
