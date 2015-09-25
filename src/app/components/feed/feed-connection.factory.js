/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('FeedConnection', feedConnectionFactory);

  feedConnectionFactory.$inject = ['ConnectionConfig', 'RemoteLoggingService'];

  /**
   * Manages the connection of a feed to the Janus server
   *
   * @constructor
   */
  function feedConnectionFactory(ConnectionConfig, log) {
    return function(pluginHandle, roomId, role) {
      var that = this;

      this.pluginHandle = pluginHandle;
      this.role = role || "subscriber";
      this.isDataOpen = false;
      this.config = null;
      log.debug(this.role + " plugin attached (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");

      this.destroy = function() {
        this.config = null;
        this.pluginHandle.detach();
      };

      this.register = function(display) {
        var register = { "request": "join", "room": roomId, "ptype": "publisher", "display": display };
        pluginHandle.send({"message": register});
      };

      this.listen = function(feedId) {
        var listen = { "request": "join", "room": roomId, "ptype": "listener", "feed": feedId };
        pluginHandle.send({"message": listen});
      };

      this.handleRemoteJsep = function(jsep) {
        pluginHandle.handleRemoteJsep({jsep: jsep});
      };

      this.sendData = function(data) {
        pluginHandle.data(data);
      };

      /**
       * Negotiates WebRTC by creating a webRTC offer for sharing the audio and
       * (optionally) video with the janus server. On success (the stream is
       * created and accepted), publishes the corresponding feed on the janus
       * server.
       *
       * @param {object} options - object with the noCamera boolean flag and
       *        some callbacks (success, error)
       */
      this.publish = function(options) {
        options = options || {};

        var media = {videoRecv: false, audioRecv: false};
        var cfg = {video: true, audio: true};
        if (this.role === "main") {
          if (options.noCamera) {
            media.videoSend = false;
            cfg.video = false;
          } else {
            media.videoSend = true;
          }
          media.audioSend = true;
          media.data = true;
        } else {
          cfg.audio = false;
          media.video = "screen";
          media.audioSend = false;
          media.data = false;
        }
        pluginHandle.createOffer({
          media: media,
          success: function(jsep) {
            log.debug("Got publisher SDP!");
            log.debug(jsep);
            that.config = new ConnectionConfig(pluginHandle, cfg, jsep);
            // Call the provided callback for extra actions
            if (options.success) { options.success(); }
          },
          error: function(error) {
            log.error("WebRTC error publishing");
            log.error(error);
            // Call the provided callback for extra actions
            if (options.error) { options.error(); }
          }
        });
      };

      /**
       * Negotiates WebRTC by creating a WebRTC answer for subscribing to
       * to a feed from the janus server.
       */
      this.subscribe = function(jsep) {
        pluginHandle.createAnswer({
          jsep: jsep,
          media: {
            audioSend: false,
            videoSend: false,
            data: true
          },
          success: function(jsep) {
            log.debug("Got SDP!");
            log.debug(jsep);
            var start = { "request": "start", "room": roomId };
            pluginHandle.send({message: start, jsep: jsep});
          },
          error: function(error) {
            log.error("WebRTC error subscribing");
            log.error(error);
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
      this.setConfig = function(options) {
        if (this.config) {
          this.config.set(options);
        } else {
          this.config = new ConnectionConfig(pluginHandle, options.values, null, options.ok);
        }
      };

      /**
       * Gets the configuration flags
       *
       * @returns {object} values of the audio and video flags
       */
      this.getConfig = function() {
        if (this.config) {
          return this.config.get();
        }
      };

      /**
       * Processes the confirmation (received from Janus) of the ongoing
       * config request
       */
      this.confirmConfig = function() {
        if (this.config) {
          return this.config.confirm();
        }
      };

      /**
       * Handler for the ondataopen event
       */
      this.onDataOpen = function() {
        this.isDataOpen = true;
      };
    };
  }
})();
