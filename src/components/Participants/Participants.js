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

  // TODO: allow to choose the order via prop.
  const orderedParticipants = Object.values(participants).sort((a, b) => {
    return a.display.localeCompare(b.display);
  });

  return (
    <div className="grid items-center grid-cols-3 lg:grid-cols-5 gap-2 row-gap-3 p-2">
      {orderedParticipants.map((participant) => {
        let {
          id,
          display,
          isPublisher,
          isLocalScreen,
          streamTimestamp,
          speaking,
          focus,
          video
        } = participant;

        return (
          <Participant
            key={id}
            id={id}
            username={display}
            isPublisher={isPublisher}
            isLocalScreen={isLocalScreen}
            streamReady={streamTimestamp}
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
