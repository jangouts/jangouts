/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import BaseInterweave, { InterweaveProps } from 'interweave';
import { useEmojiData, EmojiMatcher } from 'interweave-emoji';
import { UrlMatcher } from 'interweave-autolink';
import ImgMatcher from './ImgMatcher';

const Interweave = (props: InterweaveProps) => {
  const [emojis, source, manager] = useEmojiData({ compact: false });
  return <BaseInterweave {...props} emojiSource={source} />;
};

const renderUsername = (feed) => {
  if (!feed) {
    return null;
  }

  return <span className="username">{feed.display}</span>;
};

function Message({ type, content, text, timestamp }) {
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
        <Interweave
          content={text()}
          matchers={[
            new ImgMatcher('img'),
            new UrlMatcher('url'),
            new EmojiMatcher('emoji', {
              convertEmoticon: true,
              convertShortcode: true,
              enlargeThreshold: 0
            })
          ]}
        />
      </div>
    </li>
  );
}

export default Message;
