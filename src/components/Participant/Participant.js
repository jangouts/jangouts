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
import ParticipantActions from './ParticipantActions';
import { actionCreators as participantsActions } from '../../state/ducks/participants';

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

function Participant({ id, display, isPublisher, isLocalScreen, streamReady, focus, video }) {
  const dispatch = useDispatch();
  const videoRef = React.createRef();
  const cssClassName = `Participant ${focus === 'user' ? 'focus' : ''}`;

  useEffect(() => setVideo(id, videoRef.current), [streamReady]);

  return (
    <div className={cssClassName}>
      <div className="relative bg-gray-100">
        <video
          ref={videoRef}
          muted={isPublisher}
          autoPlay
          className={isPublisher && !isLocalScreen ? 'mirrored' : ''}
          onClick={() => dispatch(toggleFocus(id, focus))}
        />
        <ParticipantActions participantId={id} />
      </div>
      <div className="p-1 text-xs whitespace-no-wrap truncate bg-gray-200">{display}</div>
    </div>
  );
}

export default React.memo(Participant);
