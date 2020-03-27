/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';

import Participant from '../Participant';

import './Participants.css';

const Participants = () => {
  const participants = useSelector((state) => state.participants);
  const thumbnailMode = useSelector((state) => state.config.thumbnailMode);

  return (
    <div className="Participants">
      {Object.keys(participants).map((key) => {
        let {
          id,
          display,
          isPublisher,
          isLocalScreen,
          stream_timestamp,
          focus,
          video,
          picture
        } = participants[key];

        let showVideo = (isPublisher && video) || (!thumbnailMode && video);
        let thumbnail = thumbnailMode && picture;

        return (
          <Participant
            key={key}
            id={id}
            display={display}
            isPublisher={isPublisher}
            isLocalScreen={isLocalScreen}
            streamReady={stream_timestamp}
            focus={focus}
            video={showVideo}
            thumbnail={thumbnail}
          />
        );
      })}
    </div>
  );
};

export default Participants;
