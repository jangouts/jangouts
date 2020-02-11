/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';

function Message({ username, text, timestamp }) {
  // TODO: use date-fns, luxon or similar?
  const datetime = new Date(timestamp);
  const time = `${datetime.getHours()}:${String(datetime.getMinutes()).padStart('2', 0)}`;

  return (
    <li data-testid="message" className="chat-message">
      <div className="info">
        <span className="username">{username}</span>
        <time dateTime={timestamp}>{time}</time>
      </div>
      <div>{text}</div>
    </li>
  );
}

export default Message;
