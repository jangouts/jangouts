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

  return <span>{feed.display}</span>;
};

function Message({ type, index, content, text, timestamp, onRender }) {
  // TODO: use date-fns, luxon or similar?
  const datetime = new Date(timestamp);
  const time = `${datetime.getHours()}:${String(datetime.getMinutes()).padStart('2', 0)}`;

  if (type === 'chatMsg')
    return (
      <li className="message" data-testid="message" data-index={index}>
        <div className="data">
          <span>
            {content && renderUsername(content.feed)}
          </span>
          <time dateTime={timestamp}>
            {time}
          </time>
        </div>
        <Interweave content={text} onRender={onRender} />
      </li>
    );

  return (
    <li className="info" data-testid="message" data-index={index}>
      {text}
    </li>
  );
}

export default Message;
