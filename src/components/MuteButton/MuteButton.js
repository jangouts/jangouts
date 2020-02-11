/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch, useSelector } from 'react-redux';

// import './ParticipantButton.css';

function MuteButton({ participantId }) {
  const dispatch = useDispatch();
  const { audio, isPublisher } = useSelector((state) => state.participants[participantId]);
  const disabled = !(audio || isPublisher);

  return (
    <button
      disabled={disabled}
      onClick={() => dispatch(participantsActions.toggleAudio(participantId))}>
      {audio ? 'Mute' : 'Unmute'}
    </button>
  );
}

export default MuteButton;
