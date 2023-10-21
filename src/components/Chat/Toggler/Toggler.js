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

  if (settings.chatOpen) {
    title = 'Hide chat';
  } else {
    title = 'Show chat';
  }

  const { displayed, list: messages } = useSelector((state) => state.messages);

  const isUnread = (message) => {
    // We only care about chat messages, not other kind of notifications
    if (message.type !== "chatMsg") { return false }
    // We don't care about our own messages
    if (message.content.feed.isPublisher) { return false }

    return message.index > displayed;
  };

  // Use debounce to give the new messages the opportunity to be displayed
  // (that may imply waiting for an smooth scroll to finish)
  const [unread] = useDebounce(
    messages.filter((m) => isUnread(m)).length,
    300
  );

  return (
    <button
      title={title}
      data-chat-status={settings.chatOpen ? "open" : "closed"}
      onClick={toggle(dispatch, settings)}
      className="chat-toggler"
    >
      <span className={classNames(
        'unread-messages',
        unread < 1 && 'hidden',
      )}>
        {unread}
      </span>
      <MessageSquare />
    </button>
  );
}

export default Toggler;
