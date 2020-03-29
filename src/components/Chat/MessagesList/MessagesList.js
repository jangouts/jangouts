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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // FIXME: if the message contains an <img> tag, this can be triggered
  // before the image is loaded.
  useEffect(scrollToBottom);

  return (
    <div className="MessageList">
      <ul>
        {messages.map((m, index) => (
          <Message key={index} {...m} />
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessagesList;
