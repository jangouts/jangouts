/**
 * Copyright (c) [2015-2019] SUSE Linux
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

function setVideo(id, videoRef, forceUpdate) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(videoRef, stream);
  }
}

function unsetVideo(videoRef) {
  videoRef.srcObject = null;
}

function toggleFocus(id, focus) {
  return focus === 'user' ? participantsActions.unsetFocus() : participantsActions.setFocus(id);
}

function Participant({ id, display, isPublisher, isLocalScreen, streamReady, focus, video }) {
  const dispatch = useDispatch();
  const videoRef = React.createRef();
  const cssClassName = `Participant ${focus === 'user' ? 'focus' : ''}`;

  useEffect(() => {
    if (focus) {
      unsetVideo(videoRef.current);
    } else {
      setVideo(id, videoRef.current);
    }
  });

  return (
    <div className={cssClassName}>
      <video
        ref={videoRef}
        muted={isPublisher}
        autoPlay
        onClick={() => dispatch(toggleFocus(id, focus))}
      />
      <div className="display">{display}</div>
      {!isLocalScreen && <MuteButton participantId={id} />}
      {isPublisher && !isLocalScreen && <ToggleVideo video={video} />}
      {isPublisher && isLocalScreen && <StopScreenSharing id={id} />}
      {!isPublisher && <Reconnect participantId={id} />}
    </div>
  );
}

export default React.memo(Participant);
