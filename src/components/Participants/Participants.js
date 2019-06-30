import React from 'react';
import { useSelector } from 'react-redux';

import Participant from '../Participant';

import './Participants.css';

const Participants = () => {
  const participants = useSelector(state => state.participants);

  return (
    <div className="Participants">
      {Object.keys(participants).map(key => (
        <Participant key={key} {...participants[key]} />
      ))}
    </div>
  );
};;

export default Participants;
