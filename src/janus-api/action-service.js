/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createFeedFactory } from './models/feed';

export const createActionService = (
  feedsService,
  dataChannelService,
  eventsService
) => {
  let that = {};

  const createFeed = createFeedFactory(dataChannelService, eventsService);

  that.enterRoom = function(feedId, display, connection) {
    var feed = createFeed({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: true
    });
    feedsService.add(feed, { main: true });
  };

  that.leaveRoom = function() {
    feedsService.allFeeds().forEach((f) => that.destroyFeed(f.id));
  };

  that.publishScreen = function(feedId, display, connection) {
    var feed = createFeed({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: true,
      isLocalScreen: true
    });
    feedsService.add(feed);
  };

  that.remoteJoin = function(feedId, display, connection) {
    var feed = createFeed({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: false
    });
    feedsService.add(feed);
  };

  that.destroyFeed = function(feedId) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.disconnect();
    feedsService.destroy(feedId);
  };

  that.unpublishFeed = function(feedId) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.disconnect();
    feedsService.destroy(feedId);
  };

  that.ignoreFeed = function(feedId) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.ignore();
  };

  that.reconnectFeed = function(feedId, connection) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.reconnect(connection);
  };

  that.writeChatMessage = function(text) {
    dataChannelService.sendChatMessage(text);
  };

  that.toggleChannel = function(type, feed) {
    // If no feed is provided, we are muting ourselves
    if (!feed) {
      feed = feedsService.findMain();
      if (!feed) {
        return;
      }
    }
    if (!feed.getPublisher()) {
      const source = feedsService.findMain();
      eventsService.roomEvent('muteFeed', { id: feed.id, requesterId: source.id });
    }
    if (feed.isEnabled(type)) {
      var callback = null;
      // If we are muting the main feed (the only publisher that can be
      // actually muted) raise a signal
      if (type === 'audio' && feed.getPublisher()) {
        callback = function() {
          eventsService.roomEvent('muteFeed', { id: feed.id, requesterId: feed.id });
        };
      }
      feed.setEnabledChannel(type, false, { after: callback });
    } else {
      feed.setEnabledChannel(type, true);
    }
  };

  /**
   * Disable or enable audio or video for the main feed
   * @param {channel type} type
   * @param {Boolean} boolval
   */
  that.setMedia = function(type, boolval) {
    var feed = feedsService.findMain();
    if (!feed) {
      return;
    }

    feed.setEnabledChannel(type, boolval);
  };

  that.enableVideoSubscriptions = function() {
    feedsService.remoteFeeds().forEach((f) => f.setVideoSubscription(true));
  };

  that.disableVideoSubscriptions = function() {
    feedsService.remoteFeeds().forEach((f) => f.setVideoSubscription(false));
  };

  return that;
};
