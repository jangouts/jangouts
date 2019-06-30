/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createLogEntry } from './models/log-entry';

export const createDataChannelService = (feedsService, logService, eventsService) => {
  let that = {};

  that.receiveMessage = (data, remoteId) => {
    var msg = JSON.parse(data);
    var type = msg.type;
    var content = msg.content;
    var feed;
    var logEntry;

    if (type === 'chatMsg') {
      logEntry = createLogEntry('chatMsg', {
        feed: feedsService.find(remoteId),
        text: content
      });
      if (logEntry.hasText()) {
        logService.add(logEntry);
      }
    } else if (type === 'muteRequest') {
      feed = feedsService.find(content.target);
      if (feed.isPublisher) {
        feed.setEnabledChannel('audio', false, {
          after: function() {
            eventsService.emitEvent({
              type: 'muted',
              data: { cause: 'request' }
            });
          }
        });
      }
      // Log the event
      logEntry = createLogEntry('muteRequest', {
        source: feedsService.find(remoteId),
        target: feed
      });
      logService.add(logEntry);
    } else if (type === 'statusUpdate') {
      feed = feedsService.find(content.source);
      if (feed && !feed.isPublisher) {
        feed.setStatus(content.status);
      }
    } else {
      console.log('Unknown data type: ' + type);
    }
  };

  that.sendMuteRequest = (feed) => {
    var content = {
      target: feed.id
    };

    that.sendMessage('muteRequest', content);
  };

  that.sendStatus = (feed, statusOptions) => {
    var content = {
      source: feed.id,
      status: feed.getStatus(statusOptions)
    };

    that.sendMessage('statusUpdate', content);
  };

  that.sendChatMessage = (text) => {
    that.sendMessage('chatMsg', text);
  };

  that.sendMessage = (type, content) => {
    var text = JSON.stringify({
      type: type,
      content: content
    });
    var mainFeed = feedsService.findMain();
    if (mainFeed === null) {
      return;
    }
    if (!mainFeed.isDataOpen()) {
      console.log('Data channel not open yet. Skipping');
      return;
    }
    var connection = mainFeed.connection;
    connection.sendData({
      text: text,
      error: function(reason) {
        alert(reason);
      },
      success: function() {
        console.log('Data sent: ' + type);
      }
    });
  };

  return that;
};
