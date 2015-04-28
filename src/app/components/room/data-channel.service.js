(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('DataChannelService', ['$rootScope', 'FeedsService', DataChannelService]);

  function DataChannelService($rootScope, FeedsService) {
    this.sendStatus = sendStatus;
    this.sendMuteRequest = sendMuteRequest;
    this.sendMessage = sendMessage;
    this.receiveMessage = receiveMessage;

    function receiveMessage(data, remoteFeed) {
      var $$rootScope = $rootScope;
      var msg = JSON.parse(data);
      var type = msg.type;
      var content = msg.content;

      if (type === "chatMsg") {
        $$rootScope.$broadcast('chat.message', {feed: remoteFeed, content: content});
      } else if (type === "muteRequest") {
        var feed = FeedsService.find(content.target);
        if (feed.isPublisher) {
          feed.setEnabledTrack("audio", false);
        }
      } else if (type === "statusUpdate") {
        var feed = FeedsService.find(content.source);
        if (feed && !feed.isPublisher) {
          feed.setStatus(content.status);
        }
      } else {
        console.log("Unknown data type: " + type);
      }
    }

    function sendMuteRequest(feed) {
      var content = {
        target: feed.id,
      };

      sendMessage("muteRequest", content);
    }

    function sendStatus(feed) {
      var content = {
        source: feed.id,
        status: feed.getStatus()
      };

      sendMessage("statusUpdate", content);
    }

    function sendMessage(type, content) {
      var text = JSON.stringify({
        type: type,
        content: content
      });
      if (FeedsService.findMain() === null) { return; }
      var handle = FeedsService.findMain().pluginHandle;
      handle.data({
        text: text,
        error: function(reason) { alert(reason); },
        success: function() { console.log("Data sent: " + type); }
      });
    }

  }
}());
