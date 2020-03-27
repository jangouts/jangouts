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
import MuteButton from '../MuteButton';
import ToggleVideo from '../ToggleVideo';
import StopScreenSharing from '../StopScreenSharing';
import Reconnect from '../Reconnect';
import { actionCreators as participantsActions } from '../../state/ducks/participants';

import './Participant.css';

function isFocused(focus) {
  return focus === 'user';
}

function setVideo(id, videoRef) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    console.log('Attaching media stream', id);
    Janus.attachMediaStream(videoRef, stream);
  }
}

function toggleFocus(id, focus) {
  return isFocused(focus) ? participantsActions.unsetFocus() : participantsActions.setFocus(id);
}

function renderVideo(id, ref, isPublisher, isLocalScreen, focus, dispatchFn) {
  return (
    <video
      data-testid="participant-video"
      autoPlay
      ref={ref}
      muted={isPublisher}
      className={isPublisher && !isLocalScreen ? 'mirrored' : ''}
      onClick={() => dispatchFn(toggleFocus(id, focus))}
    />
  );
}

function renderImage(id, focus, thumbnail, dispatchFn) {
  const placeholder = '/placeholder.png';
  const img = isFocused(focus) ? placeholder : thumbnail || placeholder;

  return (
    <img
      data-testid="participant-thumbnail"
      src={img}
      onClick={() => dispatchFn(toggleFocus(id, focus))}
    />
  );
}

function Participant({
  id,
  display,
  isPublisher,
  isLocalScreen,
  streamReady,
  focus,
  video,
  thumbnail
}) {
  const dispatch = useDispatch();
  const videoRef = React.createRef();
  const canvasRef = React.createRef();
  const cssClassName = `Participant ${isFocused(focus) ? 'focus' : ''}`;

  useEffect(() => setVideo(id, videoRef.current), [streamReady]);

  useEffect(() => {
    if (!isPublisher || !video) {
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
    <div className={cssClassName}>
      {isPublisher && <canvas ref={canvasRef}></canvas>}
      {video
        ? renderVideo(id, videoRef, isPublisher, isLocalScreen, focus, dispatch)
        : renderImage(id, focus, thumbnail, dispatch)}
      <div className="display">{display}</div>
      {!isLocalScreen && <MuteButton participantId={id} />}
      {isPublisher && !isLocalScreen && <ToggleVideo video={video} />}
      {isPublisher && isLocalScreen && <StopScreenSharing id={id} />}
      {!isPublisher && <Reconnect participantId={id} />}
    </div>
  );
}

export default React.memo(Participant);
