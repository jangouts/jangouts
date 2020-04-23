/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Message from '../Message';

function MessagesList() {
  const messages = useSelector((state) => state.messages);
  const wrapperRef = useRef(null);
  const messagesRef = useRef(null);

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

  useEffect(updateScroll);

  return (
    <div className="h-full overflow-y-auto">
      <ul>
        {messages.map((m, index) => (
          <Message key={index} onRender={updateScroll} {...m} />
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
