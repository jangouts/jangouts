/**
 * Copyright (c) [2020] SUSE Linux
  *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera as CameraIcon, Film as FilmIcon } from 'react-feather';
import { actionCreators as roomActions } from '../../../state/ducks/room';

function ToggleThumbnailMode({className, iconStyle}) {
  const dispatch = useDispatch();
  const thumbnailMode = useSelector(state => state.room.thumbnailMode);
  const label = thumbnailMode ? "Disable thumbnail mode" : "Enable thumbnail mode"

  return (
    <button
      title={label}
      aria-label={label}
      className={className}
      onClick={() => dispatch(roomActions.toggleThumbnailMode())}>
      { thumbnailMode ? <CameraIcon/> : <FilmIcon/> }
    </button>
  )
}

export default ToggleThumbnailMode;
