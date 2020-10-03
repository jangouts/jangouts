/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ParticipantActions from './ParticipantActions';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { classNames, attachStream } from '../../utils/common';
import StreamsService from '../../utils/streams-service';
import { User as UserIcon } from 'react-feather';

function setVideo(id, videoRef) {
  const stream = StreamsService.get(id);

  if (stream !== null) {
    console.log('Attaching media stream', id);
    attachStream(videoRef, stream);
  }
}

function toggleFocus(id, focus) {
  return focus === 'user' ? participantsActions.unsetFocus() : participantsActions.setFocus(id);
}

function renderImage(id, picture) {
  if (picture) {
    return <img alt={id} src={picture} className="mirrored" />
  } else {
    return <UserIcon className={classNames('w-4/6 h-auto m-auto text-secondary')} />
  }
}

function Participant({
  id,
  username,
  isPublisher,
  isLocalScreen,
  streamReady,
  focus,
  speaking,
  video,
  picture
}) {
  const dispatch = useDispatch();
  const videoRef = React.createRef();
  const cssClassName = `Participant ${focus === 'user' ? 'focus' : ''}`;
  const canvasRef = React.createRef();

  useEffect(() => setVideo(id, videoRef.current), [streamReady]);

  useEffect(() => {
    if (!isPublisher) {
      return;
    }

    let thumbnailSource = videoRef.current;
    let thumbnailCanvas = canvasRef.current;
    let thumbnailContext = thumbnailCanvas.getContext('2d');

    const interval = setInterval(() => {
      let videoHeight = thumbnailSource.videoHeight;

      // Nothing to do if the video has no dimensions yet
      if (!videoHeight) {
        return;
      }

      let width = thumbnailCanvas.parentNode.offsetWidth;
      let height = (width * videoHeight) / thumbnailSource.videoWidth;

      thumbnailCanvas.width = width;
      thumbnailCanvas.height = height;
      thumbnailContext.drawImage(thumbnailSource, 0, 0, width, height);

      let thumbnailData = thumbnailCanvas.toDataURL('image/jpeg');
      dispatch(participantsActions.updateLocalPicture(thumbnailData));
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <div
      className={classNames(
        'relative group p-1 border-2 border-white bg-white',
        'transition duration-150 ease-in-out',
        focus && 'border-secondary shadow-md',
        speaking && 'border-green-300'
      )}>
      {isPublisher && <canvas ref={canvasRef} className="hidden"></canvas>}
      <div className="relative bg-gray-100">
        <video
          ref={videoRef}
          muted={isPublisher}
          autoPlay
          className={classNames(video || 'invisible', isPublisher && !isLocalScreen && 'mirrored')}
          onClick={() => dispatch(toggleFocus(id, focus))}
        />
        { !video && renderImage(id, picture) }
      </div>
      <div className="flex items-center p-1 bg-gray-200">
        <ParticipantActions participantId={id} />
        <div className="text-sx md:text-sm whitespace-no-wrap truncate">{username}</div>
      </div>
    </div>
  );
}

export default React.memo(Participant);
