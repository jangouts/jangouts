/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('DataChannelService', DataChannelService);

  DataChannelService.$inject = ['FeedsService', 'LogEntry', 'LogService'];

  function DataChannelService(FeedsService, LogEntry, LogService) {
    this.sendStatus = sendStatus;
    this.sendMuteRequest = sendMuteRequest;
    this.sendChatMessage = sendChatMessage;
    this.receiveMessage = receiveMessage;

    function receiveMessage(data, remoteId) {
      var msg = JSON.parse(data);
      var type = msg.type;
      var content = msg.content;
      var feed;
      var logEntry;

      if (type === "chatMsg") {
        logEntry = new LogEntry("chatMsg", {feed: FeedsService.find(remoteId), text: content});
        if (logEntry.hasText()) {
          LogService.add(logEntry);
        }
      } else if (type === "muteRequest") {
        feed = FeedsService.find(content.target);
        if (feed.isPublisher) {
          feed.setEnabledChannel("audio", false);
        }
        // Log the event
        logEntry = new LogEntry("muteRequest", {source: FeedsService.find(remoteId), target: feed});
        LogService.add(logEntry);
      } else if (type === "statusUpdate") {
        feed = FeedsService.find(content.source);
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

    function sendStatus(feed, statusOptions) {
      var content = {
        source: feed.id,
        status: feed.getStatus(statusOptions)
      };

      sendMessage("statusUpdate", content);
    }

    function sendChatMessage(text) {
      sendMessage("chatMsg", text);
    }

    function sendMessage(type, content) {
      var text = JSON.stringify({
        type: type,
        content: content
      });
      var mainFeed = FeedsService.findMain();
      if (mainFeed === null) { return; }
      if (!mainFeed.isDataOpen()) {
        console.log("Data channel not open yet. Skipping");
        return;
      }
      var connection = mainFeed.connection;
      connection.sendData({
        text: text,
        error: function(reason) { alert(reason); },
        success: function() { console.log("Data sent: " + type); }
      });
    }
  }
}());
