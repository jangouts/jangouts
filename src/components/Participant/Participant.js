/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';
import ParticipantActions from './ParticipantActions';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { classNames } from '../../utils/common';
import { User as UserIcon } from 'react-feather';

function setVideo(id, videoRef) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    console.log('Attaching media stream', id);
    Janus.attachMediaStream(videoRef, stream);
  }
}

function toggleFocus(id, focus) {
  return focus === 'user' ? participantsActions.unsetFocus() : participantsActions.setFocus(id);
}

function Participant({ id, username, isPublisher, isLocalScreen, streamReady, focus, speaking, video }) {
  const dispatch = useDispatch();
  const videoRef = React.createRef();
  const cssClassName = `Participant ${focus === 'user' ? 'focus' : ''}`;

  useEffect(() => setVideo(id, videoRef.current), [streamReady]);

  return (
    <div className={classNames(
      "relative group p-1 border-2 border-white bg-white",
      "transition duration-150 ease-in-out",
      focus === 'user' && "border-secondary shadow-md",
      speaking && "border-green-300"
    )}>
      <div className="relative bg-gray-100">
        <video
          ref={videoRef}
          muted={isPublisher}
          autoPlay
          className={classNames(
            video || "hidden",
            isPublisher && !isLocalScreen && 'mirrored'
          )}
          onClick={() => dispatch(toggleFocus(id, focus))}
        />
        <UserIcon className={classNames(
          "w-4/6 h-auto m-auto text-secondary",
          video && "hidden"
        )} />
      </div>
      <div className="flex items-center p-1 bg-gray-200">
        <ParticipantActions participantId={id} />
        <div className="text-sx md:text-sm whitespace-no-wrap truncate">{username}</div>
      </div>
    </div>
  );
}

export default React.memo(Participant);
