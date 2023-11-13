/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X as Close, MoreVertical } from 'react-feather';
import { ToggleAudio, ToggleVideo, Reconnect, StopScreenSharing } from './Actions';
import { classNames, discardFalses } from '../../utils/common';

function ParticipantActions({ participantId }) {
  const [showMore, setShowMore] = useState(false);
  const participant = useSelector((state) => state.participants[participantId]);

  if (!participant) {
    return null;
  }

  const { isPublisher, isLocalScreen, video } = participant;

  const commonProps = {
    participantId: participantId
  };

  const visibleActionsProps = {
    ...commonProps,
    showLabel: false
  };

  const moreActionsProps = {
    ...commonProps,
    showLabel: true
  };

  const visibleActions = discardFalses([
    !isLocalScreen && <ToggleAudio key="toggle-audio-action" {...visibleActionsProps} />,
    isPublisher && isLocalScreen && (
      <StopScreenSharing key="stop-sharing-action" {...visibleActionsProps} />
    ),
    isPublisher && !isLocalScreen && (
      <ToggleVideo key="toggle-video-action" video={video} {...visibleActionsProps} />
    )
  ]);

  const moreActions = discardFalses([
    !isPublisher && <Reconnect key="reconnect-action" {...moreActionsProps} />
  ]);

  if (moreActions.length) {
    return [
      <div
        className="show-more-actions"
        onClick={() => setShowMore(!showMore)}>
        {showMore ? <Close /> : <MoreVertical />}
      </div>,
      <React.Fragment>
        {visibleActions}
      </React.Fragment>,
      <div
        className={classNames(
          'more-actions',
          showMore || 'hidden'
        )}>
        {moreActions}
      </div>
    ];
  }

  return visibleActions;
}

export default ParticipantActions;
