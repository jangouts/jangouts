/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { StopCircle } from 'react-feather';
import { actionCreators as participantsActions } from '../../../state/ducks/participants';
import { classNames } from '../../../utils/common';

import ParticipantActionButton from './ParticipantActionButton';

function StopScreenSharing({ participantId, ...props }) {
  const dispatch = useDispatch();
  const label = 'Stop Screen Sharing';

  return (
    <ParticipantActionButton
      icon={StopCircle}
      label={label}
      iconStyle={classNames("text-red-600", props.iconStyle)}
      onClick={() => dispatch(participantsActions.stopScreenSharing(participantId))}
      {...props}
    />
  );
}

export default StopScreenSharing;
