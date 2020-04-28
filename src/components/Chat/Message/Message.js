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

function Message({ type, content, text, timestamp, onRender }) {
  // TODO: use date-fns, luxon or similar?
  const datetime = new Date(timestamp);
  const time = `${datetime.getHours()}:${String(datetime.getMinutes()).padStart('2', 0)}`;

  return (
    <li className="rounded m-2 p-2 bg-white overflow-x-auto shadow" data-testid="message">
      <div className="flex justify-between">
        <div className="mr-1 font-bold text-xs md:text-sm">
          {content && renderUsername(content.feed)}
        </div>
        <time className="font-mono text-xs text-primary" dateTime={timestamp}>
          {time}
        </time>
      </div>
      <div className="px-2">
        <Interweave content={text()} onRender={onRender} />
      </div>
    </li>
  );
}

export default Message;
