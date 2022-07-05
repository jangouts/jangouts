/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as chatActions } from '../../../state/ducks/messages';

import Message from '../Message';

function MessagesList() {
  const wrapperRef = useRef(null);
  const messagesRef = useRef(null);
  const dispatch = useDispatch();

  const filterMessages = (messages) => {
    // Avoid the pointless initial stream of messages like "x has joined the room"
    // when entering a room in which there are partitipants already. Even if that
    // means filtering a bit too much in some cases.
    const first = messages.findIndex((msg) => msg.type !== 'newRemoteFeed');
    return first < 0 ? [] : messages.slice(first);
  };

  const wasDisplayed = (message, threshold = 0) => {
    const messageBottom = message.offsetTop + message.clientHeight;

    const wrapper = wrapperRef.current;
    const wrapperViewBottom = wrapper.scrollTop + wrapper.clientHeight;

    return messageBottom <= wrapperViewBottom + threshold;
  };

  const mustScroll = (message) => {
    const previous = message.previousSibling;

    // Since the smooth scroll takes some time to execute, an extra threshold is applied
    // to prevent the situation in which several messages arriving almost at the same
    // time manage to leave the scroll behind. If you don't know what I mean, remove the
    // threshold and type many messages very quick. ;-)
    return !wasDisplayed(message) && (!previous || wasDisplayed(previous, 40));
  };

  const latestDisplayedMessage = () => {
    const messages = messagesRef.current.children;
    const displayed = Array.from(messages).filter((msg) => wasDisplayed(msg));
    return displayed.slice(-1)[0];
  };

  /*
   * Move the scroll to the latest message if needed
   */
  const updateScroll = () => {
    const lastMsg = messagesRef.current.lastChild;

    if (!lastMsg || !mustScroll(lastMsg)) return;

    lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  /*
   * Update the state information about which messages have already be seen
   */
  const updateDisplayed = () => {
    const displayed = latestDisplayedMessage();
    if (displayed) {
      const idx = parseInt(displayed.dataset.index);
      if (idx === null) { return }
      dispatch(chatActions.markDisplayed(idx));
    }
  };

  const update = () => {
    updateScroll();
    updateDisplayed();
  };

  // Update the scroll and the unread count after each render
  useEffect(update);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.addEventListener("scroll", updateDisplayed);
      wrapper.addEventListener("resize", updateDisplayed);
      // Set the scroll at bottom just after mounting the component
      wrapper.scrollTo({ top: wrapper.scrollHeight });
    }
  }, []);

  const messages = filterMessages(useSelector((state) => state.messages.list));

  return (
    <div ref={wrapperRef} className="h-full overflow-y-auto" role="log">
      <ul ref={messagesRef}>
        {messages.map((m, index) => (
          <Message key={index} {...m} />
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
