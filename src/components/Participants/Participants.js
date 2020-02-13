/**
 * Copyright (c) [2015-2019] SUSE Linux
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

  return (
    <div className="Participants">
      {Object.keys(participants).map((key) => {
        let { id, display, isPublisher, stream_timestamp, focus, video } = participants[key];

        return (
          <Participant
            key={key}
            id={id}
            display={display}
            isPublisher={isPublisher}
            streamReady={stream_timestamp}
            focus={focus}
            video={video}
          />
        );
      })}
    </div>
  );
};

export default Participants;
