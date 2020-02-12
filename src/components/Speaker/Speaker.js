/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../state/ducks/participants';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

import './Speaker.css';

function setVideo(id, video, forceUpdate) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function Speaker() {
  const video = React.createRef();
  const speaker = useSelector(
    (state) => selectors.focusedParticipant(state.participants),
    (a, b) => a.id === b.id && a.stream_timestamp === b.stream_timestamp
  );

  const { id, display, isPublisher } = speaker || {};

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <div className="Speaker">
      <video ref={video} muted={isPublisher} autoPlay />
      <div className="display">{display}</div>
    </div>
  );
}

export default Speaker;
