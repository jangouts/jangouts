/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Janus } from '../vendor/janus';
import { createRoomFromJanus } from './models/room';
import { createFeedConnection } from './models/feed-connection';

/**
 * Returns the Janus server URL from the configuration
 *
 * @param {String} server Janus server URI
 * @param {String} sslServer Janus SSL server URI
 * @param {Boolean} useSSL Whether to use SSL or not
 */
const configuredJanusServer = (server, sslServer, useSSL) =>
  sslServer && useSSL ? sslServer : server;

/**
 * Guess the default janus server
 *
 * @todo it is copied from the old room service. Please, refactor.
 */
const defaultJanusServer = (useSSL) => {
  var wsProtocol;
  var wsPort;

  if (useSSL) {
    wsProtocol = 'wss:';
    wsPort = '8989';
  } else {
    wsProtocol = 'ws:';
    wsPort = '8188';
  }

  return [
    wsProtocol + '//' + window.location.hostname + ':' + wsPort + '/janus/',
    window.location.protocol + '//' + window.location.hostname + '/janus/'
  ];
};

/**
 * Builds an object to interact with a Janus server
 *
 * @param {Object} config Janus config options
 * @property {String} config.janusServer Janus server URL
 * @property {String} config.janusServerSSL Janus SSL server URL
 * @property {Boolean} config.janusDebug NOT IMPLEMENTED
 * @property {Boolean} config.janusWithCredentials Set credentials in XHR requests
 * @property {Integer} config.joinUnmutedLimit Feeds limit to connect as unmuted
 * @property {Boolean} config.videThumbnails Use only thumbnails
 * @property {Boolean} config.useSSL Whether to use SSL or not (TODO: autodetect?)
 * @returns {Object}
 */
export const createRoomService = (
  config,
  feedsService,
  dataChannelService,
  eventsService,
  actionService
) => {
  const { janusServer, janusServerSSL, janusWithCredentials, useSSL, joinUnmutedLimit } = config;
  // TODO: the logic for default values should be encapsulated in a proper object
  const videoThumbnails = config.videoThumbnails === undefined ? true : config.videoThumbnails;
  const createFeedConnectionFactory = createFeedConnection(eventsService);
  let startMuted = false;

  let that = {
    room: null,
    pin: null,
    privateId: null,
    withCredentials: !!janusWithCredentials
  };
  that.server =
    configuredJanusServer(janusServer, janusServerSSL, useSSL) || defaultJanusServer(useSSL);

  /**
   * Connects to the Janus server
   *
   * @returns {Promise}
   */
  that.connect = () => {
    return new Promise(function(resolve, reject) {
      if (that.janus) {
        resolve(true);
      } else {
        Janus.init();
        console.log(that.server);
        that.janus = new Janus({
          server: that.server,
          withCredentials: that.withCredentials,
          success: () => resolve(true),
          error: (e) => {
            // TODO: move this to a better place
            const msg = `Janus error: ${e}. Do you want to reload in order to retry?"`;
            reject();
            if (window.confirm(msg)) {
              window.location.reload();
            }
          },
          destroyed: () => console.log('Janus object destroyed')
        });
      }
    });
  };

  /**
   * Returns the list of rooms from the server
   *
   * This function makes sures that a connection already exists, but the real work is done by the
   * doGetRooms function.
   *
   * @returns {Promise<Array>} List of rooms from the server
   */
  that.getRooms = () => {
    return new Promise((resolve) => {
      that.connect().then(() => {
        that.doGetRooms().then((rooms) => resolve(rooms));
      });
    });
  };

  /**
   * Returns the list of rooms from the server
   *
   * @todo This function should be private.
   *
   * @returns {Promise<Array>} List of rooms from the server
   */
  that.doGetRooms = () => {
    return new Promise((resolve, reject) => {
      that.janus.attach({
        plugin: 'janus.plugin.videoroom',
        error: (error) => console.error(error),
        success: function(pluginHandle) {
          console.log(
            'getAvailableRooms plugin attached (' +
              pluginHandle.getPlugin() +
              ', id=' +
              pluginHandle.getId() +
              ')'
          );
          const request = { request: 'list' };
          pluginHandle.send({
            message: request,
            success: function(result) {
              // Free the resource (it looks safe to do it here)
              pluginHandle.detach();
              if (result.videoroom === 'success') {
                var rooms = result.list.map((r) => createRoomFromJanus(r));
                resolve(rooms);
              } else {
                reject();
              }
            }
          });
        }
      });
    });
  };

  // Enter the room
  that.enter = (username, pin) => {
    return new Promise((resolve, reject) => {
      that.connect().then(function() {
        that.doEnter(username, pin);
        resolve();
      });
    });
  };

  that.doEnter = (username, pin) => {
    var connection = null;
    that.pin = pin;

    // sending user joining event
    eventsService.auditEvent('user');

    // send user joining event
    // Create new session
    that.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: function(pluginHandle) {
        // sending 'pluginHandle attached' event
        eventsService.auditEvent('pluginHandle');

        // Step 1. Right after attaching to the plugin, we send a request to join
        connection = createFeedConnectionFactory(pluginHandle, that.room.id, 'main');
        connection.register(username, pin);
      },
      error: function(error) {
        console.error('Error attaching plugin... ' + error);
      },
      consentDialog: function(on) {
        console.log('Consent dialog should be ' + (on ? 'on' : 'off') + ' now');
        eventsService.roomEvent('consentDialog', { on });
        if (!on) {
          //notify if joined muted
          if (startMuted) {
            eventsService.roomEvent(
              'muteFeed',
              { id: feedsService.findMain().id, participantsLimit: joinUnmutedLimit }
            );
          }
        }
      },
      ondataopen: function() {
        console.log('The publisher DataChannel is available');
        connection.onDataOpen();
        that.sendStatus();
      },
      onlocaltrack: function(track, _on) {
        // Step 4b (parallel with 4a).
        // Send the created stream to the UI, so it can be attached to
        // some element of the local DOM
        let feed = feedsService.findMain();
        feed.addTrack(track);
        emitStreamEvents(feed);
      },
      oncleanup: function() {
        console.log(' ::: Got a cleanup notification: we are unpublished now :::');
      },
      onmessage: function(msg, jsep) {
        var event = msg.videoroom;
        console.debug('Event: ' + event);

        // Step 2. Response from janus confirming we joined
        if (event === 'joined') {
          console.log('Successfully joined room ' + msg.room);
          // sending user joined event
          eventsService.auditEvent('user');

          that.privateId = msg.private_id;
          actionService.enterRoom(msg.id, username, connection);
          // Step 3. Establish WebRTC connection with the Janus server

          // Step 4a (parallel with 4b). Publish our feed on server

          if (isPresent(joinUnmutedLimit)) {
            startMuted =
              isArray(msg.publishers) && msg.publishers.length >= joinUnmutedLimit;
          }

          connection.publish({
            muted: startMuted,
            error: function() {
              connection.publish({ noCamera: true, muted: startMuted });
            }
          });

          // Step 5. Attach to existing feeds, if any
          if (isArray(msg.attendees)) {
            that.addFeeds(msg.attendees, false);
          }
          if (isArray(msg.publishers)) {
            that.addFeeds(msg.publishers, true);
          }
          // The room has been destroyed
        } else if (event === 'destroyed') {
          console.log('The room has been destroyed!');
          eventsService.roomEvent('destroyRoom', {});
        } else if (event === 'event') {
          // Any new feed to attach to?
          if (isArray(msg.publishers)) {
            that.addFeeds(msg.publishers, true);
          }
          // Any new non-publishing attendee?
          if (isPresent(msg.joining)) {
            that.addFeed(msg.joining.id, msg.joining.display, false);
          }
          // One of the publishers has gone away?
          if (isPresent(msg.leaving)) {
            var leaving = msg.leaving;
            actionService.destroyFeed(leaving);
          }
          // One of the publishers has unpublished?
          if (isPresent(msg.unpublished)) {
            var unpublished = msg.unpublished;
            actionService.unpublishFeed(unpublished);
          }
          // Reply to a configure request
          if (msg.configured) {
            connection.confirmConfig();
            let feed = feedsService.findMain();
            eventsService.roomEvent('updateFeed', { id: feed.id, ...feed.getStatus() });
          }
          // The server reported an error
          if (isPresent(msg.error)) {
            console.log('Error message from server' + msg.error);
            eventsService.roomEvent('reportError', { error: msg.error });
          }
        }

        if (isPresent(jsep)) {
          connection.handleRemoteJsep(jsep);
        }
      }
    });
  };

  that.leave = function leave() {
    actionService.leaveRoom();
    that.pin = null;
  };

  that.setRoom = function(room) {
    that.room = room;
  };

  that.getRoom = function() {
    return that.room;
  };

  that.addFeeds = function(list, subscribe) {
    if (list.length === 0) { return; }

    console.debug('Got a list of available feeds (' + subscribe + '):', list);
    for (var f = 0; f < list.length; f++) {
      var id = list[f].id;
      var display = list[f].display;
      that.addFeed(id, display, subscribe);
    }
  };

  that.addFeed = function(id, display, subscribe) {
    var feed = feedsService.find(id);

    if (subscribe) {
      if (feed === null || feed.waitingForConnection()) {
        this.subscribeToFeed(id, display);
      }
    } else {
      if (feed === null) {
        actionService.remoteJoin(id, display, null);
      }
    }
  };

  that.subscribeToFeed = function(id, display) {
    var feed = feedsService.find(id);
    var connection = null;

    if (feed) {
      display = feed.display;
    }

    // emit 'subscribe' event
    eventsService.auditEvent('subscriber');

    that.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: function(pluginHandle) {
        // emit subscriber plugin attached event
        eventsService.auditEvent('pluginHandle');
        connection = createFeedConnectionFactory(pluginHandle, that.room.id, 'subscriber');
        connection.listen(id, that.pin, that.privateId);
      },
      error: function(error) {
        console.error('  -- Error attaching plugin... ' + error);
      },
      onmessage: function(msg, jsep) {
        var event = msg.videoroom;
        if (event === 'attached') {
          // Subscriber created and attached
          // emit 'subscriber attached' event
          eventsService.auditEvent('subscriber');

          // TODO: is the timeout needed?
          window.setTimeout(function() {
            if (feed) {
              actionService.connectToFeed(id, connection);
            } else {
              actionService.remoteJoin(id, display, connection);
            }
            console.log(
              'Successfully attached to feed ' + id + ' (' + display + ') in room ' + msg.room
            );
          });
        } else if (msg.configured) {
          connection.confirmConfig();
        } else if (msg.started) {
          // Initial setConfig, needed to complete all the initializations
          connection.setConfig({ values: { audio: true, data: true, video: videoThumbnails } });
        } else if (msg.error_code === 428) {
          console.log("We tried to subscribe to a feed that is not publishing (an attendee)");
          actionService.stopIgnoringFeed(id);
        } else {
          console.log('What has just happened?!', msg);
        }

        if (isPresent(jsep)) {
          connection.subscribe(jsep);
        }
      },
      onremotetrack: function(track, _on) {
        feedsService.waitFor(id).then(feed => {
          feed.addTrack(track);
          emitStreamEvents(feed);
        }).catch(console.error);
      },
      ondataopen: function() {
        console.log('The subscriber DataChannel is available');
        connection.onDataOpen();
        // Send status information of all our feeds to inform the newcommer
        that.sendStatus();
      },
      ondata: function(data) {
        dataChannelService.receiveMessage(data, id);
      },
      oncleanup: function() {
        console.log(' ::: Got a cleanup notification (remote feed ' + id + ') :::');
      }
    });
  };

  that.publishScreen = function(videoSource) {
    var feed = feedsService.findMain();
    var display = feed.display;
    var connection;
    var id;

    // emit `screenshare` event
    eventsService.auditEvent('screenshare');

    that.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: function(pluginHandle) {
        // emit screenshare plugin attached event
        eventsService.auditEvent('pluginHandle');
        connection = createFeedConnectionFactory(pluginHandle, that.room.id, videoSource);
        connection.register(display, that.pin);
        // TODO: ScreenShareService.setInProgress(true);
      },
      error: function(error) {
        console.error('  -- Error attaching screen plugin... ' + error);
      },
      onlocaltrack: function(track, _on) {
        let feed = feedsService.find(id);
        feed.addTrack(track);
        emitStreamEvents(feed);
        eventsService.auditEvent('screenshare');
      },
      oncleanup: function() {
        eventsService.auditEvent('screenshareStop');
        // TODO: ScreenShareService.setInProgress(false);
      },
      onmessage: function(msg, jsep) {
        console.debug(' ::: Got a message (screen) :::', msg);
        var event = msg.videoroom;

        if (event === 'joined') {
          id = msg.id;
          actionService.publishScreen(id, display, connection);

          connection.publish({
            success: function() {
              // TODO: ScreenShareService.setInProgress(false);
            },
            error: function(error) {
              console.log(error);
              unPublishFeed(id);
              // TODO
              // ScreenShareService.setInProgress(false);
              // ScreenShareService.showHelp();
            }
          });
          // Reply to a configure request
        } else if (msg.configured) {
          connection.confirmConfig();
          eventsService.roomEvent('updateFeed', { id: feed.id, ...feed.getStatus() });
        } else {
          console.log('Unexpected event for screen', msg);
        }
        if (isPresent(jsep)) {
          connection.handleRemoteJsep(jsep);
        }
      }
    });
  };

  that.unPublishFeed = function(feedId) {
    return unPublishFeed(feedId);
  };

  function unPublishFeed(feedId) {
    actionService.destroyFeed(feedId);
  }

  that.ignoreFeed = function(feedId) {
    actionService.ignoreFeed(feedId);
  };

  that.reconnectFeed = function(feedId) {
    that.subscribeToFeed(feedId);
  };

  that.toggleChannel = function(type, feed) {
    actionService.toggleChannel(type, feed);
  };

  /**
   * Broadcast status information of all our feeds when a data channel is
   * established.
   *
   * To increase the chances of the info to be received, it sends the most
   * important information right away and the whole status some seconds after.
   * Hacky and dirty, we know.
   */
  that.sendStatus = function() {
    feedsService.publisherFeeds().forEach(function(p) {
      dataChannelService.sendStatus(p, { exclude: 'picture' });
      window.setTimeout(function() {
        dataChannelService.sendStatus(p);
      }, 4000);
    });
  };

  /**
   * Check whether the given argument has a value.
   */
  function isPresent(value) {
    return (value !== undefined && value !== null);
  };

  /**
   * Check whether the given argument is an Array.
   */
  function isArray(value) {
    return (value instanceof Array);
  };

  /**
   * Registers the stream related events
   *
   * @param {object} feed - Feed to inform about
   */
  function emitStreamEvents(feed) {
    eventsService.roomEvent('updateStream', { feedId: feed.id, stream: feed.getStream() });
    eventsService.auditEvent('stream');
  }

  return that;
};
