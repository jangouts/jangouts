/**
 * Copyright (c) [2015-2019] SUSE Linux
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
    let feed = createFeed({
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
    let feed = createFeed({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: true,
      isLocalScreen: true
    });
    feedsService.add(feed);
  };

  that.remoteJoin = function(feedId, display, connection) {
    let feed = createFeed({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: false
    });
    feedsService.add(feed);
  };

  that.connectToFeed = function(feedId, connection) {
    let feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    if (feed.ignored) {
      that.stopIgnoringFeed(feedId);
    }

    feed.setConnection(connection);
  };

  that.destroyFeed = function(feedId) {
    let feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.disconnect();
    feedsService.destroy(feedId);
  };

  that.unpublishFeed = function(feedId) {
    let feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.disconnect();
  };

  that.ignoreFeed = function(feedId) {
    let feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.ignore();
  };

  that.stopIgnoringFeed = function(feedId) {
    let feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.setIgnored(false);
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
      let callback = null;
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
   * @param {channel_type} type
   * @param {Boolean} boolval
   */
  that.setMedia = function(type, boolval) {
    let feed = feedsService.findMain();
    if (!feed) {
      return;
    }

    feed.setEnabledChannel(type, boolval);
  };

  return that;
};
