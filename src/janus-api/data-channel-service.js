/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

export const createDataChannelService = (feedsService, eventsService) => {
  let that = {};

  that.receiveMessage = (data, remoteId) => {
    var msg = JSON.parse(data);
    var type = msg.type;
    var content = msg.content;
    var feed;

    if (type === 'chatMsg') {
      eventsService.roomEvent('createChatMsg', {
        feedId: remoteId,
        text: content
      });
    } else if (type === 'muteRequest') {
      feed = feedsService.find(content.target);

      eventsService.roomEvent('muteFeed', { id: feed.id, requesterId: remoteId });

      if (feed.getPublisher()) {
        feed.setEnabledChannel('audio', false);
      }
    } else if (type === 'statusUpdate') {
      feed = feedsService.find(content.source);
      if (feed && !feed.getPublisher()) {
        feed.setStatus(content.status);
        eventsService.roomEvent('updateFeed', { id: feed.id, ...feed.getStatus() });
      }
    } else if (type === 'speakingSignal') {
      eventsService.roomEvent('updateFeed', { id: content.source, speaking: content.speaking });
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

  that.sendSpeakingSignal = (feed) => {
    const speaking = feed.getStatus().speaking;
    const content = {
      source: feed.id,
      speaking: speaking
    };

    that.sendMessage('speakingSignal', content);
  };

  that.sendChatMessage = (text) => {
    eventsService.roomEvent('createChatMsg', {
        feedId: feedsService.findMain().id,
        text: text
    });
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
