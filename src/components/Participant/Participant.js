/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';

import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

import './Participant.css';

function setVideo(id, video) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function Participant({ id, display }) {
  const video = React.createRef();

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <div className="Participant">
      <video ref={video} autoPlay />
      <div className="display">{display}</div>
    </div>
  );
}

export default Participant;
