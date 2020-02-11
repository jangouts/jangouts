/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch } from 'react-redux';

// import './ParticipantButton.css';

function MuteButton({ id, audio, isPublisher }) {
  const dispatch = useDispatch();
  const disabled = !(audio || isPublisher);

  return (
    <button disabled={disabled} onClick={() => dispatch(participantsActions.toggleAudio(id))}>
      {audio ? 'Mute' : 'Unmute'}
    </button>
  );
}

export default MuteButton;
