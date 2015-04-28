(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('ActionService', ['Feed', 'FeedsService', ActionService]);

  function ActionService(Feed, FeedsService) {
    this.enterRoom = enterRoom;
    this.leaveRoom = leaveRoom;
    this.remoteJoin = remoteJoin;
    this.detachRemoteFeed = detachRemoteFeed;

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
      for (var feed in FeedsService.allFeeds()) {
        feed.pluginHandle.detach();
        FeedsService.destroy(feed.id);
      }
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

    function detachRemoteFeed(feedId) {
      var feed = FeedsService.find(feedId);
      if (feed === null) { return };
      console.log("Feed " + feedId + " (" + feed.display + ") has left the room, detaching");
      feed.pluginHandle.detach();
      FeedsService.destroy(feedId);
    }
  }
}());
