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
      {Object.keys(participants).map((key) => (
        <Participant key={key} {...participants[key]} />
      ))}
    </div>
  );
};

export default Participants;
