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

    function enterRoom(feedId, display, mainHandle) {
      var feed = new Feed({
        display: display,
        pluginHandle: mainHandle,
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

    function publishScreen(feedId, display, handle) {
      var feed = new Feed({
        display: display,
        pluginHandle: handle,
        id: feedId,
        isPublisher: true,
        isLocalScreen: true
      });
      FeedsService.add(feed);
    }

    function remoteJoin(feedId, display, pluginHandle) {
      var feed = new Feed({
        display: display,
        pluginHandle: pluginHandle,
        id: feedId,
        isPublisher: false
      });
      FeedsService.add(feed);
    }

    function destroyFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      console.log("Destroying feed " + feedId + " (" + feed.display + ")");
      if (feed.pluginHandle) {
        feed.pluginHandle.detach();
      }
      $timeout(function () {
        FeedsService.destroy(feedId);
      });
    }

    function ignoreFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      console.log("Ignoring feed " + feed.id + " (" + feed.display + ")");
      feed.isIgnored = true;
      feed.pluginHandle.detach();
      feed.pluginHandle = null;
    }

    function stopIgnoringFeed(feedId, handle) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      console.log("Stop ignoring feed " + feed.id + " (" + feed.display + ")");
      feed.isIgnored = false;
      feed.pluginHandle = handle;
    }

    function writeChatMessage(text) {
      var entry = new LogEntry("chatMsg", {feed: FeedsService.findMain(), text: text});
      $timeout(function () {
        LogService.add(entry);
      });
      DataChannelService.sendChatMessage(text);
    }
  }
}());
