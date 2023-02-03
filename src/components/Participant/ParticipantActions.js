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
    showLabel: false,
    className: 'w-4 mr-1'
  };

  const moreActionsProps = {
    ...commonProps,
    showLabel: true,
    className: 'w-full p-1 hover:bg-primary'
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
        className="absolute top-0 right-0 z-50 w-6 h-6 mt-2 mr-2 cursor-pointer opacity-75 bg-white rounded-full"
        onClick={() => setShowMore(!showMore)}>
        {showMore ? <Close className="w-2/3 m-auto text-secondary" /> : <MoreVertical />}
      </div>,
      <React.Fragment>
        {visibleActions}
      </React.Fragment>,
      <div
        className={classNames(
          'absolute top-0 inset-x-0 min-h-full bg-primary-dark opacity-75 overflow-hidden',
          showMore ? 'flex flex-col' : 'hidden'
        )}>
        {moreActions}
      </div>
    ];
  }

  return visibleActions;
}

export default ParticipantActions;
