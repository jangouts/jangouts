/**
 * Copyright (c) [2023] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../state/ducks/participants';
import { ToggleAudio, ToggleVideo } from './Actions';

function HeaderActions() {
  const participant = useSelector((state) => selectors.localParticipant(state.participants));

  if (!participant) {
    return null;
  }

  const actionsProps = {
    participantId: participant.id,
    showLabel: false,
    activeClassNames: 'action-on',
    inactiveClassNames: 'action-off',
  };

  return [
    <ToggleAudio key="toggle-audio-header" {...actionsProps} />,
    <ToggleVideo key="toggle-video-header" video={participant.video} {...actionsProps} />
  ];
}

export default HeaderActions;
