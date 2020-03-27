/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';
import MuteButton from '../MuteButton';
import ToggleVideo from '../ToggleVideo';
import StopScreenSharing from '../StopScreenSharing';
import Reconnect from '../Reconnect';
import { actionCreators as participantsActions } from '../../state/ducks/participants';

import './Participant.css';

function classNames(...classes) {
  return classes.filter((item) => !!item).join(' ');
}

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
  const videoRef = React.createRef();
  const canvasRef = React.createRef();

  const dispatch = useDispatch();
  const interval = useSelector((state) => state.config.thumbnailModeInterval);

  const placeholder = '/placeholder.png';
  const picture = isFocused(focus) ? placeholder : thumbnail || placeholder;

  // Initialize the video
  useEffect(() => setVideo(id, videoRef.current), [streamReady]);

  // Take the thumbnail picture
  useEffect(() => {
    // The thumbnail will be taken only for the publisher if the video is
    // available, as long as a valid interval has been defined. With a not
    // defined interval, the function will be rescheduled too many times PER
    // SECOND (every 4ms?), which is a BIG penalty for the performance.
    if (!(isPublisher && video && interval)) {
      return;
    }

    let thumbnailSource = videoRef.current;
    let thumbnailCanvas = canvasRef.current;
    let thumbnailContext = thumbnailCanvas.getContext('2d');

    const takePicture = setInterval(() => {
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
    }, interval);

    return () => clearInterval(takePicture);
  });

  return (
    <div className={classNames('Participant', isFocused(focus) && 'focus')}>
      {isPublisher && <canvas ref={canvasRef}></canvas>}
      <div onClick={() => dispatch(toggleFocus(id, focus))}>
        <video
          data-testid="participant-video"
          autoPlay
          ref={videoRef}
          muted={isPublisher}
          className={classNames(isPublisher && !isLocalScreen && 'mirrored', video && 'visible')}
        />
        <img
          src={picture}
          className={classNames(!video && 'visible')}
          data-testid="participant-thumbnail"
        />
        <div className="display">{display}</div>
      </div>
      <div id="actions">
        {!isLocalScreen && <MuteButton participantId={id} />}
        {isPublisher && !isLocalScreen && <ToggleVideo video={video} />}
        {isPublisher && isLocalScreen && <StopScreenSharing id={id} />}
        {!isPublisher && <Reconnect participantId={id} />}
      </div>
    </div>
  );
}

export default React.memo(Participant);
