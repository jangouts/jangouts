/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This module offers an API to interact with a Janus server.
 *
 * @todo Read configuration.
 */
import { Janus } from '../vendor/janus';
import { createRoomService } from './room-service';
import { createFeedsService } from './feeds-service';
import { createEventsService } from './events-service';
import { createDataChannelService } from './data-channel-service';
import { createActionService } from './action-service';

export default (function() {
  var that = {
    dataChannelService: null,
    eventsService: null,
    feedsService: null,
    roomService: null,
    actionService: null
  };

  that.setup = function(
    { janusServer, janusServerSSL, joinUnmutedLimit, videoThumbnails },
    handler
  ) {
    that.eventsService = createEventsService();
    that.feedsService = createFeedsService(that.eventsService);
    that.dataChannelService = createDataChannelService(
      that.feedsService,
      that.eventsService
    );

    that.actionService = createActionService(
      that.feedsService,
      that.dataChannelService,
      that.eventsService
    );

    that.roomService = createRoomService(
      { janusServer, janusServerSSL, joinUnmutedLimit, videoThumbnails },
      that.feedsService,
      that.dataChannelService,
      that.eventsService,
      that.actionService
    );

    if (handler) {
      that.getRoomSubject().subscribe(handler);
    }
  };

  that.getRooms = () => that.roomService.getRooms();
  that.enterRoom = (room, username, pin) => {
    that.roomService.setRoom(room);
    return that.roomService.enter(username, pin);
  };
  that.publishScreen = () => that.roomService.publishScreen('screen');
  that.unpublishFeed = (feedId) => that.roomService.unPublishFeed(feedId);
  that.leaveRoom = () => that.roomService.leave();
  that.getRoomSubject = () => that.eventsService.getRoomSubject();
  that.sendMessage = (text) => that.actionService.writeChatMessage(text);

  that.toggleAudio = (feedId) => {
    let feed = that.feedsService.find(feedId);
    if (!feed) return;

    that.roomService.toggleChannel('audio', feed);
  };
  that.toggleVideo = () => {
    that.roomService.toggleChannel('video');
  };
  that.reconnectFeed = (feedId) => that.roomService.reconnectFeed(feedId);

  return that;
})();
