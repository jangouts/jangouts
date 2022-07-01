/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Message from '../Message';

function MessagesList() {
  const wrapperRef = useRef(null);
  const messagesRef = useRef(null);

  const filterMessages = (messages) => {
    // Avoid the pointless initial stream of messages like "x has joined the room"
    // when entering a room in which there are partitipants already. Even if that
    // means filtering a bit too much in some cases.
    const first = messages.findIndex((msg) => msg.type !== 'newRemoteFeed');
    return first < 0 ? [] : messages.slice(first);
  };

  const mustScroll = (message) => {
    // FIXME: instead of using this threshold, we could verify whether the
    // previous message is right at the end of the viewport
    const threshold = 100;
    const wrapper = wrapperRef.current;

    const wrapperViewBottom = wrapper.scrollTop + wrapper.clientHeight;
    const msgTop = message.offsetTop;
    const msgBottom = msgTop + message.clientHeight;

    return msgBottom > wrapperViewBottom && msgTop <= wrapperViewBottom + threshold;
  };

  const updateScroll = () => {
    const lastMsg = messagesRef.current.lastChild;

    if (!lastMsg || !mustScroll(lastMsg)) return;

    lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Update the scroll after each render
  useEffect(updateScroll);

  // Set the scroll at bottom just after mounting the component
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.scrollTo({ top: wrapper.scrollHeight });
    }
  }, []);

  const messages = filterMessages(useSelector((state) => state.messages));

  return (
    <div ref={wrapperRef} className="h-full overflow-y-auto" role="log">
      <ul ref={messagesRef}>
        {messages.map((m, index) => (
          <Message key={index} onRender={updateScroll} {...m} />
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
