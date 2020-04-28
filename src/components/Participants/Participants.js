/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';

import Participant from '../Participant';

const Participants = () => {
  const participants = useSelector((state) => state.participants);

  return (
    <div className="grid items-center grid-cols-3 lg:grid-cols-5 gap-2 row-gap-3 p-2">
      {Object.keys(participants).map((key) => {
        let {
          id,
          display,
          isPublisher,
          isLocalScreen,
          stream_timestamp,
          speaking,
          focus,
          video
        } = participants[key];

        return (
          <Participant
            key={key}
            id={id}
            username={display}
            isPublisher={isPublisher}
            isLocalScreen={isLocalScreen}
            streamReady={stream_timestamp}
            speaking={speaking}
            focus={focus}
            video={video}
          />
        );
      })}
    </div>
  );
};

export default Participants;
