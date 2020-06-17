/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

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

    if (that.content.source.isPublisher) {
      res = 'You have muted ';
    } else {
      res = that.content.source.display + ' has muted ';
    }
    if (that.content.target.isPublisher) {
      res += 'you';
    } else {
      res += that.content.target.display;
    }
    return res;
  };

  that.chatMsgText = function() {
    return that.content.text;
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
    return that.content.name + ' has joined the room';
  };

  that.reconnectFeedText = function() {
    return 'Connected again with ' + that.content.feed.name;
  };

  return that;
};
