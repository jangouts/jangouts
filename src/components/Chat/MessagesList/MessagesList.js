/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React from 'react';
import { useSelector } from 'react-redux';

import Message from '../Message';

function MessagesList() {
  const messages = useSelector((state) => state.messages);

  return (
    <div className="MessageList">
      <ul>
        {messages.map((m, index) => (
          <Message key={index} {...m} />
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
