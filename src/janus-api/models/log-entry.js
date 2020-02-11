/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import DOMPurify from 'dompurify';

export const createLogEntry = (type, content) => {
  let that = {
    type,
    content,
    timestamp: new Date()
  };

  that.text = function() {
    return that[that.type + 'Text']();
  };

  that.muteRequestText = function() {
    var res;

    if (that.content.feed.isPublisher) {
      res = 'You have muted ';
    } else {
      res = that.content.feed.display + ' has muted ';
    }
    if (that.content.target.isPublisher) {
      res += 'you';
    } else {
      res += that.content.target.display;
    }
    return res;
  };

  that.chatMsgText = function() {
    return DOMPurify.sanitize(that.content.text);
  };

  that.publishScreenText = function() {
    return 'Screen sharing started';
  };

  that.destroyFeedText = function() {
    if (that.content.feed.isLocalScreen) {
      return 'Screen sharing stopped';
    } else {
      return that.content.feed.display + ' has left the room';
    }
  };

  that.newRemoteFeedText = function() {
    return that.content.feed.display + ' has joined the room';
  };

  that.ignoreFeedText = function() {
    return 'You are ignoring ' + that.content.feed.display + ' now';
  };

  that.stopIgnoringFeedText = function() {
    return 'You are not longer ignoring ' + that.content.feed.display;
  };

  that.hasText = function() {
    return that.text() !== '';
  };

  return that;
};
