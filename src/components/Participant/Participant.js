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
import { actionCreators as participantsActions } from '../../state/ducks/participants';

import './Participant.css';

function setVideo(id, video) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function Participant({ id, display, isPublisher, audio }) {
  const video = React.createRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <div className="Participant">
      <video ref={video} muted={isPublisher} autoPlay />
      <div className="display">{display}</div>
      <button onClick={() => dispatch(participantsActions.toggleAudio(id))}>
        {audio ? 'Mute' : 'Unmute'}
      </button>
    </div>
  );
}

export default Participant;
