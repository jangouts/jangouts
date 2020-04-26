/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X as Close, MoreVertical } from 'react-feather';
import { ToggleAudio, ToggleVideo, Reconnect, StopScreenSharing } from './Actions';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { classNames, discardFalses } from '../../utils/common';

function ParticipantActions({participantId, className}) {
  const [showMore, setShowMore] = useState(false);
  const participant = useSelector((state) => state.participants[participantId]);

  if(!participant) {
    return null;
  }

  const { isPublisher, isLocalScreen, video } = participant;

  const commonProps = {
    participantId: participantId
  };

  const visibleActionsProps = {
    ...commonProps,
    showLabel: false,
    className: "rounded-full w-6 p-1 mx-px bg-gray-100 hover:bg-gray-300 opacity-75 cursor-pointer"
  }

  const moreActionsProps = {
    ...commonProps,
    showLabel: true,
    className: "p-1 hover:bg-primary"
  }

  const visibleActions = discardFalses([
    <ToggleAudio {...visibleActionsProps} />,
    isPublisher && isLocalScreen && <StopScreenSharing {...visibleActionsProps} />,
    isPublisher && !isLocalScreen && <ToggleVideo video={video} {...visibleActionsProps} />
  ]);

  const moreActions = discardFalses([
    !isPublisher && <Reconnect {...moreActionsProps} />
  ]);

  if (moreActions.length) {
    return [
        <div className="absolute top-0 right-0 z-50 mt-1 mr-1 cursor-pointer opacity-75 bg-white rounded-full"
          onClick={() => setShowMore(!showMore)}>
          { showMore ? <Close className="w-2/3 m-auto text-secondary" /> : <MoreVertical /> }
        </div>,
        <div className="absolute bottom-0 w-full text-center">
          { visibleActions }
        </div>,
        <div
          className={classNames(
            "absolute top-0 inset-x-0 min-h-full bg-primary-dark opacity-75 overflow-hidden",
            showMore && "flex flex-col" || "hidden",
          )}>
          {moreActions}
        </div>
      ];
  }

  return (
    <div className="absolute bottom-0 w-full text-center">
      { visibleActions }
    </div>
  );
}

export default ParticipantActions;
