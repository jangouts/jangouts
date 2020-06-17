/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../state/ducks/participants';
import janusApi from '../../janus-api';
import { classNames, attachStream } from '../../utils/common';

function setVideo(id, video, forceUpdate) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    attachStream(video, stream);
  }
}

function Speaker() {
  const video = React.createRef();
  const speaker = useSelector(
    (state) => selectors.focusedParticipant(state.participants),
    (a, b) => a.id === b.id && a.stream_timestamp === b.stream_timestamp
  );

  const { id, isPublisher, isLocalScreen } = speaker || {};

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <video
      ref={video}
      muted={isPublisher}
      className={classNames(
        'max-h-full w-full focus:outline-none',
        isPublisher && !isLocalScreen && 'mirrored'
      )}
      autoPlay
    />
  );
}

export default Speaker;
