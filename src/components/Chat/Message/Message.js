/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Interweave from './Interweave';

const renderUsername = (feed) => {
  if (!feed) {
    return null;
  }

  return <span className="username">{feed.display}</span>;
};

function Message({ type, content, text, timestamp, onRender }) {
  // TODO: use date-fns, luxon or similar?
  const datetime = new Date(timestamp);
  const time = `${datetime.getHours()}:${String(datetime.getMinutes()).padStart('2', 0)}`;

  return (
    <li data-testid="message" className="chat-message">
      <div className="info">
        {content && renderUsername(content.feed)}
        <time dateTime={timestamp}>{time}</time>
      </div>
      <div>
        <Interweave content={text()} onRender={onRender} />
      </div>
    </li>
  );
}

export default Message;
