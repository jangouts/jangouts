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
import { useDebounce } from 'use-debounce';

function toggle(dispatch, settings) {
  return () => {
    const newSettings = {...settings, chatOpen: !settings.chatOpen };
    dispatch(roomActions.saveSettings(newSettings));
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
  } else {
    title = 'Show chat';
    classes = 'bg-primary-dark hover:bg-primary text-white';
  }

  const { displayed, list: messages } = useSelector((state) => state.messages);

  // Use debounce to give the new messages the opportunity to be displayed
  // (that may imply waiting for an smooth scroll to finish)
  const [unread] = useDebounce(
    messages.filter((m) => m.type === "chatMsg" && m.index > displayed).length,
    300
  );

  const counterPosition = `absolute -top-2 -right-${unread < 99 ? 2 : 3}`;
  const counterStyle =
    'p-0.5 shadow-md bg-secondary text-xs text-white rounded-full flex justify-center items-center items';

  return (
    <button title={title} onClick={toggle(dispatch, settings)}>
      <strong className="relative inline-flex items-center top-0.5">
        <span className={classNames(unread > 0 || 'hidden', counterPosition, counterStyle)}>
          <span>{unread}</span>
        </span>
        <MessageSquare className={classNames('p-0.5 rounded', classes)} />
      </strong>
    </button>
  );
}

export default Toggler;
