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
import { actionCreators as participantsActions } from '../../state/ducks/participants';

import './Participant.css';

function setVideo(id, video, forceUpdate) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function unsetVideo(video) {
  video.srcObject = null;
}

function toggleFocus(id, focus) {
  return focus === 'user' ? participantsActions.unsetFocus() : participantsActions.setFocus(id);
}

function Participant({ id, display, isPublisher, streamReady, focus }) {
  const dispatch = useDispatch();
  const video = React.createRef();
  const cssClassName = `Participant ${focus === 'user' ? 'focus' : undefined}`;

  useEffect(() => {
    if (focus) {
      unsetVideo(video.current);
    } else {
      setVideo(id, video.current);
    }
  });

  return (
    <div onClick={() => dispatch(toggleFocus(id, focus))} className={cssClassName}>
      <video ref={video} muted={isPublisher} autoPlay />
      <div className="display">{display}</div>
      <MuteButton participantId={id} />
    </div>
  );
}

export default React.memo(Participant);
