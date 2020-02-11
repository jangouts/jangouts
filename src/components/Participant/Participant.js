/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';
import MuteButton from '../MuteButton';

import './Participant.css';

function setVideo(id, video) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function Participant({ id, display, isPublisher, audio }) {
  const video = React.createRef();

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <div className="Participant">
      <video ref={video} muted={isPublisher} autoPlay />
      <div className="display">{display}</div>
      <MuteButton id={id} audio={audio} isPublisher={isPublisher} />
    </div>
  );
}

export default Participant;
