(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('DataChannelService', ['$rootScope', DataChannelService]);

  function DataChannelService($rootScope) {
    this.sendMessage = sendMessage;
    this.receiveMessage = receiveMessage;

    function sendMessage(type, content) {
      var text = JSON.stringify({
        type: type,
        content: content
      });
      if (window.publisherFeed.stream === null) { return; }
      var handle = window.publisherFeed.pluginHandle;
      handle.data({
        text: text,
        error: function(reason) { alert(reason); },
        success: function() { console.log("Data sent: " + type); }
      });
    }

    function receiveMessage(data, remoteFeed) {
      var $$rootScope = $rootScope;
      var msg = JSON.parse(data);
      var type = msg.type;
      var content = msg.content;

      if (type === "chatMsg") {
        $$rootScope.$broadcast('chat.message', {feed: remoteFeed, content: content});
      } else if (type === "setTrackStatusRequest") {
        if (window.publisherFeed.id === content.target) {
          window.publisherFeed.setEnabledTrack(content.trackType, content.enabled);
        }
      } else if (type === "statusUpdate") {
        remoteFeed.updateStatus(content);
      } else {
        console.log("Unknown data type: " + type);
      }
    }
  }
}());
