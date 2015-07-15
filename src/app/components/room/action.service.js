/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('ActionService', ActionService);

  ActionService.$inject = ['$timeout', 'Feed', 'FeedsService', 'LogEntry',
    'LogService', 'DataChannelService'];

  function ActionService($timeout, Feed, FeedsService, LogEntry, LogService, DataChannelService) {
    this.enterRoom = enterRoom;
    this.leaveRoom = leaveRoom;
    this.remoteJoin = remoteJoin;
    this.destroyFeed = destroyFeed;
    this.ignoreFeed = ignoreFeed;
    this.stopIgnoringFeed = stopIgnoringFeed;
    this.writeChatMessage = writeChatMessage;
    this.publishScreen = publishScreen;
    this.toggleChannel = toggleChannel;

    function enterRoom(feedId, display, mainHandle, publishingFromStart) {
      var feed = new Feed({
        display: display,
        pluginHandle: mainHandle,
        id: feedId,
        isPublisher: true,
        audioEnabled: publishingFromStart,
        videoEnabled: publishingFromStart
      });
      FeedsService.add(feed, {main: true});
    }

    function leaveRoom() {
      var that = this;

      _.forEach(FeedsService.allFeeds(), function(feed) {
        that.destroyFeed(feed.id);
      });
    }

    function publishScreen(feedId, display, handle) {
      var feed = new Feed({
        display: display,
        pluginHandle: handle,
        id: feedId,
        isPublisher: true,
        isLocalScreen: true
      });
      FeedsService.add(feed);
      // Log the event
      var entry = new LogEntry("publishScreen");
      LogService.add(entry);
    }

    function remoteJoin(feedId, display, pluginHandle) {
      var feed = new Feed({
        display: display,
        pluginHandle: pluginHandle,
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
      if (feed.pluginHandle) {
        feed.pluginHandle.detach();
      }
      $timeout(function () {
        FeedsService.destroy(feedId);
      });
      // Log the event
      var entry = new LogEntry("destroyFeed", {feed: feed});
      LogService.add(entry);
    }

    function ignoreFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      feed.isIgnored = true;
      feed.pluginHandle.detach();
      feed.pluginHandle = null;
      // Log the event
      var entry = new LogEntry("ignoreFeed", {feed: feed});
      LogService.add(entry);
    }

    function stopIgnoringFeed(feedId, handle) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      feed.isIgnored = false;
      feed.pluginHandle = handle;
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
      var o = {};
      if (feed[type + "Enabled"]) {
        o[type] = false;
      } else {
        o[type] = true;
      }
      feed.configure(o);
    }
  }
}());
