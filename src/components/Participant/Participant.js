import React from 'react';

import './Participant.css';

function Participants({ id, username }) {
  return (
    <div className="Participant">
      <div className="username">{username}</div>
    </div>
  );
}

export default Participants;
