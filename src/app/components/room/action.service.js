/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts.actionService', [])
    .service('ActionService', ActionService);

  ActionService.$inject = ['$timeout', 'Feed', 'FeedsService', 'LogEntry',
    'LogService', 'DataChannelService', '$rootScope'];

  function ActionService($timeout, Feed, FeedsService, LogEntry, LogService, DataChannelService, $rootScope) {
    this.enterRoom = enterRoom;
    this.leaveRoom = leaveRoom;
    this.remoteJoin = remoteJoin;
    this.destroyFeed = destroyFeed;
    this.ignoreFeed = ignoreFeed;
    this.stopIgnoringFeed = stopIgnoringFeed;
    this.writeChatMessage = writeChatMessage;
    this.publishScreen = publishScreen;
    this.toggleChannel = toggleChannel;
    this.setMedia = setMedia;

    function enterRoom(feedId, display, connection) {
      var feed = new Feed({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: true
      });
      FeedsService.add(feed, {main: true});
    }

    function leaveRoom() {
      var that = this;

      _.forEach(FeedsService.allFeeds(), function(feed) {
        that.destroyFeed(feed.id);
      });
    }

    function publishScreen(feedId, display, connection) {
      var feed = new Feed({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: true,
        isLocalScreen: true
      });
      FeedsService.add(feed);
      // Log the event
      var entry = new LogEntry("publishScreen");
      LogService.add(entry);
    }

    function remoteJoin(feedId, display, connection) {
      var feed = new Feed({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: false
      });
      FeedsService.add(feed);
      // Log the event
      var entry = new LogEntry("newRemoteFeed", {feed: feed});
      LogService.add(entry);
    }

    function destroyFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      $timeout(function () {
        feed.disconnect();
        FeedsService.destroy(feedId);
      });
      // Log the event
      var entry = new LogEntry("destroyFeed", {feed: feed});
      LogService.add(entry);
    }

    function ignoreFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      feed.ignore();
      // Log the event
      var entry = new LogEntry("ignoreFeed", {feed: feed});
      LogService.add(entry);
    }

    function stopIgnoringFeed(feedId, connection) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      feed.stopIgnoring(connection);
      // Log the event
      var entry = new LogEntry("stopIgnoringFeed", {feed: feed});
      LogService.add(entry);
    }

    function writeChatMessage(text) {
      var entry = new LogEntry("chatMsg", {feed: FeedsService.findMain(), text: text});
      if (entry.hasText()) {
        LogService.add(entry);
        DataChannelService.sendChatMessage(text);
      }
    }

    function toggleChannel(type, feed) {
      // If no feed is provided, we are muting ourselves
      if (!feed) {
        feed = FeedsService.findMain();
        if (!feed) { return; }
      }
      if (!feed.isPublisher) {
        // Log the event
        var entry = new LogEntry("muteRequest", {source: FeedsService.findMain(), target: feed});
        LogService.add(entry);
      }
      if (feed.isEnabled(type)) {
        var callback = null;
        // If we are muting the main feed (the only publisher that can be
        // actually muted) raise a signal
        if (type === "audio" && feed.isPublisher) {
          callback = function() { $rootScope.$broadcast('muted.byUser'); };
        }
        feed.setEnabledChannel(type, false, {after: callback});
      } else {
        feed.setEnabledChannel(type, true);
      }
    }

    /**
     * Disable or enable audio or video for the main feed
     * @param {channel type} type
     * @param {Boolean} boolval
     */
    function setMedia(type, boolval) {
      var feed = FeedsService.findMain();
      if (!feed) { return; }

      feed.setEnabledChannel(type, boolval);
    }
  }
}());
