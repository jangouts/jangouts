import React, { useEffect } from 'react';

import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

import './Participant.css';

function setVideo(id, video) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== undefined) {
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
