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
    this.detachFeed = detachFeed;
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
        that.detachFeed(feed.id);
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

    function detachFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return; }
      console.log("Detaching feed " + feedId + " (" + feed.display + ")");
      feed.pluginHandle.detach();
      FeedsService.destroy(feedId);
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
