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

  feedConnectionFactory.$inject = ['ConnectionConfig'];

  /**
   * Manages the connection of a feed to the Janus server
   *
   * TODO: most of the code in room.service could be moved to callbacks here
   *
   * @constructor
   */
  function feedConnectionFactory(ConnectionConfig) {
    return function(pluginHandle, roomId, role) {
      var that = this;

      this.pluginHandle = pluginHandle;
      this.role = role || "subscriber";
      this.isDataOpen = false;
      this.config = null;
      console.log(this.role + " plugin attached (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");

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
       * @param {object} options - object with some boolean flags (noCamera,
       *        noAudioOnStart, noVideoOnStart) and some callbacks
       *        (success, error)
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
          if (options.noAudioOnStart) { cfg.audio = false; }
          if (options.noVideoOnStart) { cfg.video = false; }
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
            console.log("Got publisher SDP!");
            console.log(jsep);
            that.config = new ConnectionConfig(pluginHandle, cfg, jsep);
            // Call the provided callback for extra actions
            if (options.success) { options.success(); }
          },
          error: function(error) {
            console.error("WebRTC error publishing");
            console.error(error);
            // Call the provided callback for extra actions
            if (options.error) { options.error(); }
          }
        });
      };

      /**
       * Negotiates WebRTC by creating a WebRTC answer for subscribing to
       * to a feed from the janus server.
       *
       * @param {object} options - object with one boolean flags (withVideo, to
       *        decide the initial config) and some callbacks (success, error)
       */
      this.subscribe = function(jsep, options) {
        options = options || {};

        pluginHandle.createAnswer({
          jsep: jsep,
          media: {
            audioSend: false,
            videoSend: false,
            data: true
          },
          success: function(jsep) {
            console.log("Got SDP!");
            console.log(jsep);
            var start = { "request": "start", "room": roomId };
            pluginHandle.send({message: start, jsep: jsep});
            // Is it ok to send the configure without waiting for
            // the response to the start command?
            var config = {audio: true, video: false};
            if (options.withVideo) { config.video = true; }
            that.config = new ConnectionConfig(pluginHandle, config, jsep);
            // Call the provided callback for extra actions
            if (options.success) { options.success(); }
          },
          error: function(error) {
            console.error("WebRTC error subscribing");
            console.error(error);
            // Call the provided callback for extra actions
            if (options.error) { options.error(); }
          }
        });
      };

      /**
       * Sets the configuration flags
       *
       * @param {object} values - values for the audio and video flags
       */
      this.setConfig = function(values) {
        if (this.config) { 
          this.config.set(values);
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
       * Handler for the ondataopen event
       */
      this.onDataOpen = function() {
        this.isDataOpen = true;
      };
    };
  }
})();
