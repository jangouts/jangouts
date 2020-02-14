/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createLogEntry } from './models/log-entry';
import { createFeedFactory } from './models/feed';

export const createActionService = (
  feedsService,
  logService,
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
    // Log the event
    var entry = createLogEntry('newRemoteFeed', { feed: feed });
    logService.add(entry);
  };

  that.destroyFeed = function(feedId) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.disconnect();
    feedsService.destroy(feedId);
    // Log the event
    var entry = createLogEntry('destroyFeed', { feed: feed });
    logService.add(entry);
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
    // Log the event
    var entry = createLogEntry('ignoreFeed', { feed: feed });
    logService.add(entry);
  };

  that.reconnectFeed = function(feedId, connection) {
    var feed = feedsService.find(feedId);
    if (feed === null) {
      return;
    }
    feed.reconnect(connection);
    // Log the event
    var entry = createLogEntry('reconnectFeed', { feed: feed });
    logService.add(entry);
  };

  that.writeChatMessage = function(text) {
    var entry = createLogEntry('chatMsg', {
      feed: feedsService.findMain(),
      text: text
    });
    if (entry.hasText()) {
      logService.add(entry);
      dataChannelService.sendChatMessage(text);
    }
  };

  that.toggleChannel = function(type, feed) {
    // If no feed is provided, we are muting ourselves
    if (!feed) {
      feed = feedsService.findMain();
      if (!feed) {
        return;
      }
    }
    if (!feed.isPublisher) {
      // Log the event
      var entry = createLogEntry('muteRequest', {
        source: feedsService.findMain(),
        target: feed
      });
      logService.add(entry);
    }
    if (feed.isEnabled(type)) {
      var callback = null;
      // If we are muting the main feed (the only publisher that can be
      // actually muted) raise a signal
      if (type === 'audio' && feed.isPublisher) {
        callback = function() {
          eventsService.emitEvent({ type: 'muted', data: { cause: 'user' } });
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

  return that;
};
