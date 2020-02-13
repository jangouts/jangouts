/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { actionCreators as participantsActions } from '../../state/ducks/participants';
import { useDispatch } from 'react-redux';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';

function ToggleVideo({video}) {
  const dispatch = useDispatch();
  const Icon = video ? FaVideoSlash : FaVideo;
  const label = video ? 'Switch Video Off' : 'Switch Video On';

  return (
    <button
      title={label}
      aria-label={label}
      onClick={() => dispatch(participantsActions.toggleVideo())}>
      <Icon />
    </button>
  );
}

export default ToggleVideo;
