/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createConnectionConfig } from './connection-config';

export const createFeedConnection = (eventsService) => (
  pluginHandle,
  roomId,
  role = 'subscriber'
) => {
  let that = {
    pluginHandle,
    roomId,
    role,
    isDataOpen: false,
    config: null
  };

  console.log(
    that.role +
      ' plugin attached (' +
      pluginHandle.getPlugin() +
      ', id=' +
      pluginHandle.getId() +
      ')'
  );

  that.destroy = function() {
    // emit 'handle detached' event
    eventsService.emitEvent({
      type: 'pluginHandle',
      data: {
        status: 'detached',
        for: role,
        pluginHandle: pluginHandle
      }
    });
    that.config = null;
    pluginHandle.detach();
  };

  that.register = function(display, pin) {
    var register = {
      request: 'join',
      room: roomId,
      ptype: 'publisher',
      display: display,
      pin: pin || ''
    };
    pluginHandle.send({ message: register });
  };

  that.listen = function(feedId, pin) {
    var listen = { request: 'join', room: roomId, ptype: 'listener', feed: feedId, pin: pin || '' };
    pluginHandle.send({ message: listen });
  };

  that.handleRemoteJsep = function(jsep) {
    pluginHandle.handleRemoteJsep({ jsep: jsep });
  };

  that.sendData = function(data) {
    pluginHandle.data(data);
  };

  /**
   * Negotiates WebRTC by creating a webRTC offer for sharing the audio and
   * (optionally) video with the janus server. The audio is optionally muted.
   * On success (the stream is created and accepted), publishes the corresponding
   * feed on the janus server.
   *
   * @param {object} options - object with the noCamera boolean flag, muted boolean flag,
   * and some callbacks (success, error)
   * @property {Boolean} options.muted
   * @property {Boolean} options.noCamera
   * @property {Function} options.success Callback to be executed when the feed is successfully published
   * @property {Function} options.error Callback to be executed when the feed is not published
   */
  that.publish = function(options) {
    options = options || {};

    var media = { videoRecv: false, audioRecv: false };
    var cfg = { video: true, audio: true };
    if (that.role === 'main') {
      if (options.muted) {
        cfg.audio = false;
      }
      if (options.noCamera) {
        media.videoSend = false;
        cfg.video = false;
      } else {
        media.videoSend = true;
      }
      media.audioSend = true;
      media.data = true;
      cfg.data = true;
    } else {
      // Publishing something but not "main" -> screen sharing
      cfg.audio = false;
      cfg.data = false;
      media.video = that.role;
      media.audioSend = false;
      media.data = false;
    }
    pluginHandle.createOffer({
      media: media,
      success: function(jsep) {
        console.log('Got publisher SDP!');
        console.log(jsep);
        that.config = createConnectionConfig(pluginHandle, cfg, jsep);
        // Call the provided callback for extra actions
        if (options.success) {
          options.success();
        }
      },
      error: function(error) {
        console.error('WebRTC error publishing');
        console.error(error);
        // emit 'error Create Offer' event
        eventsService.emitEvent({
          type: 'error',
          data: {
            status: 'createOffer',
            error: error,
            peerconnection: that.pluginHandle.webrtcStuff.pc
          }
        });
        // Call the provided callback for extra actions
        if (options.error) {
          options.error();
        }
      }
    });
  };

  /**
   * Negotiates WebRTC by creating a WebRTC answer for subscribing to
   * to a feed from the janus server.
   */
  that.subscribe = function(jsep) {
    pluginHandle.createAnswer({
      jsep: jsep,
      media: {
        audioSend: false,
        videoSend: false,
        data: true
      },
      success: function(jsep) {
        console.log('Got SDP!');
        console.log(jsep);
        var start = { request: 'start', room: roomId };
        pluginHandle.send({ message: start, jsep: jsep });
      },
      error: function(error) {
        console.error('WebRTC error subscribing');
        console.error(error);
        // emit 'error CreateAnswer' event
        eventsService.emitEvent({
          type: 'error',
          data: {
            status: 'createAnswer',
            error: error,
            peerconnection: that.pluginHandle.webrtcStuff.pc
          }
        });
      }
    });
  };

  /**
   * Sets the configuration flags
   *
   * @param {object} options - object containing
   *        * values: object with the wanted values for the flags
   *        * ok: callback to execute on confirmation from Janus
   */
  that.setConfig = function(options) {
    if (that.config) {
      that.config.set(options);
    } else {
      var cfg = createConnectionConfig(pluginHandle, options.values, null, options.ok);
      that.config = cfg;
    }
  };

  /**
   * Gets the configuration flags
   *
   * @returns {object} values of the audio and video flags
   */
  that.getConfig = function() {
    if (that.config) {
      return that.config.get();
    }
  };

  /**
   * Processes the confirmation (received from Janus) of the ongoing
   * config request
   */
  that.confirmConfig = function() {
    if (that.config) {
      return that.config.confirm();
    }
  };

  /**
   * Handler for the ondataopen event
   */
  that.onDataOpen = function() {
    that.isDataOpen = true;
  };

  return that;
};
