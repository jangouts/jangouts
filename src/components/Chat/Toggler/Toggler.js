/**
 * Copyright (c) [2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../../../state/ducks/room';
import { MessageSquare } from 'react-feather';
import { classNames } from '../../../utils/common';

function toggle(dispatch, settings) {
  return () => {
    settings.chatOpen = !settings.chatOpen;
    dispatch(roomActions.saveSettings(settings));
  };
}

function Toggler() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.room);

  let title;
  let classes;

  if (settings.chatOpen) {
    title = 'Hide chat';
    classes = 'bg-white text-primary';
  }
  else {
    title = 'Show chat';
    classes = 'bg-primary-dark hover:bg-primary text-white';
  }

  return (
    <button title={ title } onClick={toggle(dispatch, settings)}>
      <MessageSquare className={classNames('p-1 rounded', classes)} />
    </button>
  );
}

export default Toggler;
