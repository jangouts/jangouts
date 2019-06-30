/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import React from 'react';
import { useSelector } from 'react-redux';

function MessagesList() {
  const messages = useSelector((state) => state.messages);

  return (
    <div className="MessageList">
      <ul>
        {messages.map((m) => (
          <li key={m.timestamp}>{m.text()}</li>
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
