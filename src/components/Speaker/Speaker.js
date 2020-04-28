/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../state/ducks/participants';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';
import { classNames } from '../../utils/common';

import ToggleFullscreen from '../Room/Actions/ToggleFullscreen';

function setVideo(id, video, forceUpdate) {
  const stream = janusApi.getFeedStream(id);

  if (stream !== null) {
    Janus.attachMediaStream(video, stream);
  }
}

function Speaker() {
  const video = React.createRef(null);
  const videoWrapper = React.createRef(null);
  const speaker = useSelector(
    (state) => selectors.focusedParticipant(state.participants),
    (a, b) => a.id === b.id && a.stream_timestamp === b.stream_timestamp
  );

  const { id, isPublisher, isLocalScreen } = speaker || {};

  useEffect(() => {
    setVideo(id, video.current);
  });

  return (
    <div ref={videoWrapper} className="relative inline-flex w-full h-full">
      <video
        ref={video}
        muted={isPublisher}
        className={classNames(
          'max-h-full w-full focus:outline-none',
          isPublisher && !isLocalScreen && 'mirrored'
        )}
        autoPlay
      />
      <ToggleFullscreen
        elementRef={videoWrapper}
        className={classNames(
          "absolute top-0 right-0"
        )}
      />
    </div>
  );
}

export default Speaker;
