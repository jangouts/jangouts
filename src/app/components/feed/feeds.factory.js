/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  /**
   * Namespace for whole jangouts
   * @module janusHangouts
   */
  angular.module('janusHangouts')
    .factory('Feed', feedFactory);

  feedFactory.$inject = ['$timeout', 'DataChannelService', 'SpeakObserver', 
                         'jhEventsProvider'];

  /**
   * Factory representing a janus feed
   * @constructor
   * @memberof module:janusHangouts
   */
  function feedFactory($timeout, DataChannelService, SpeakObserver, 
                       jhEventsProvider) {
    return function(attrs) {
      attrs = attrs || {};
      var that = this;

      /** @var {integer} id of feed */
      this.id = attrs.id || 0;
      /** @var {string} name of user streaming feed */
      this.display = attrs.display || null;
      /** @var {boolean} flag if feed is publishing one, so one that is send from this pc to others */
      this.isPublisher = attrs.isPublisher || false;
      /** @var {boolean} flag if feed is local screen sharing feed */
      this.isLocalScreen = attrs.isLocalScreen || false;
      /** @var {boolean} flag if feed is ignored */
      this.isIgnored = attrs.ignored || false;

      this.connection = attrs.connection || null;

      var picture = null;
      var speaking = false;
      var silentSince = Date.now();
      var videoRemoteEnabled = true;
      var audioRemoteEnabled = true;
      var stream = null;
      var speakObserver = null;

      /**
       * Checks if a given channel is enabled
       *
       * @param {string} channel - "audio" or "video"
       * @returns {boolean}
       */
      this.isEnabled = function(channel) {
        if (this.isPublisher) {
          if (this.connection && this.connection.getConfig()) {
            return this.connection.getConfig()[channel];
          } else {
            return null;
          }
        } else {
          return (channel === "audio") ? audioRemoteEnabled : videoRemoteEnabled;
        }
      };

      /**
       * Checks if a given local track is enabled.
       *
       * Take into account the term 'track' refers to the local tracks of the
       * stream as rendered by the browser, not to the webRTC communication
       * channels. For example, disabling a local audio track will cause the
       * browser to stop reproducing the sound, but will not cause the browser
       * to stop receiving it through the corresponding channel.
       *
       * @param {string} type - "audio" or "video"
       * @returns {boolean}
       */
      this.isTrackEnabled = function(type) {
        var track = getTrack(type);
        return (track !== null && track.enabled);
      };

      /*
       * Enables or disables the given track.
       *
       * See isTrackEnabled for more information about tracks vs channels.
       *
       * @param {string} type - "audio" or "video"
       * @param {boolean} enabled
       */
      this.setEnabledTrack = function(type, enabled) {
        var track = getTrack(type);
        if (track !== null) {
          track.enabled = enabled;
        }
      };

      /*
       * Checks whether the feed has a given track.
       *
       * See isTrackEnabled for more information about tracks vs channels.
       *
       * @param {string} type - "audio" or "video"
       */
      this.hasTrack = function(type) {
        return (getTrack(type) !== null);
      };

      /**
       * Sets picture for picture channel
       * @param {string} val - path to picture
       */
      this.setPicture = function(val) {
        picture = val;
      };

      /**
       * Gets picture for picture channel
       * @return {string} path to picture
       */
      this.getPicture = function() { return picture; };

      /**
       * Sets janus stream for the feed
       * @param {object} val - janus stream
       */
      this.setStream = function(val) {
        if (this.isPublisher && !this.isLocalScreen) {
          speakObserver = new SpeakObserver(val, {
            start: function() {
              updateLocalSpeaking(true);
            },
            stop: function() {
              updateLocalSpeaking(false);
            }
          });
        }
        stream = val;
      };

      /**
       * Gets janus stream for the feed
       * @return {object} janus stream
       */
      this.getStream = function() { return stream; };


      /**
       * Sets speaking flag
       * @param {boolean} val - true if feed speaking
       */
      this.setSpeaking = function(val) {
        speaking = val;
      };

      /**
       * Gets feed speaking flag
       * @return {boolean} true if feed speaking
       */
      this.getSpeaking = function() { return speaking; };

      /**
       * Sets if audio is enabled for this feed. Works only for remote ones.
       */
      this.setAudioEnabled = function(val) {
        audioRemoteEnabled = val;
      };

      /**
       * Gets if audio is enabled for this feed
       */
      this.getAudioEnabled = function() {
        return this.isEnabled("audio");
      };

      /**
       * Sets if video is enabled for this feed. Works only for remote ones.
       */
      this.setVideoEnabled = function(val) {
        videoRemoteEnabled = val;
      };

      /**
       * Gets if video is enabled for this feed
       */
      this.getVideoEnabled = function() {
        return this.isEnabled("video");
      };

      /**
       * Checks if audio is being currently detected in the local feed
       *
       * @returns {Boolean}
       */
      this.isVoiceDetected = function() {
        return speakObserver && speakObserver.isSpeaking();
      };

      /**
       * Checks if data channel is open
       * @returns {boolean}
       */
      this.isDataOpen = function() {
        if (this.connection) {
          return this.connection.isDataOpen;
        } else {
          return false;
        }
      };

      /**
       * Checks if the feed is connected to janus.
       *
       * @returns {boolean}
       */
      this.isConnected = function() {
        return (this.connection !== null);
      };

      /**
       * Disconnects from janus
       */
      this.disconnect = function() {
        if (this.connection) {
          this.connection.destroy();
        }
        if (speakObserver) {
          speakObserver.destroy();
        }
        this.connection = null;
      };

      /**
       * Starts ignoring the feed
       */
      this.ignore = function() {
        this.isIgnored = true;
        this.disconnect();
      };

      /**
       * Stops ignoring the feed
       *
       * @param {FeedConnection} connection - new connection to Janus
       */
      this.stopIgnoring = function(connection) {
        this.isIgnored = false;
        this.connection = connection;
      };

      /**
       * Checks if the feed is waiting for the connection to janus to be set
       *
       * @returns {boolean}
       */
      this.waitingForConnection = function() {
        return (this.isIgnored === false && !this.connection);
      };

      /*
       * Enables or disables the given channel
       *
       * If the feed is a publisher, it directly configures the connection to
       * Janus. If the feed is a subscriber, it request the configuration change
       * to the remote peer (only for audio, management of remote video is not
       * implemented).
       *
       * @param {string} type - "audio" or "video"
       * @param {boolean} enabled
       * @param {object} options - use the 'after' key to specify a callback
       *        that will be called after configuring the connection.
       */
      this.setEnabledChannel = function(type, enabled, options) {
        var that = this;
        options = options || {};

        if (this.isPublisher) {
          var config = {};
          config[type] = enabled;
          this.connection.setConfig({
            values: config,
            ok: function() {
              $timeout(function() {
                if (type === 'audio' && enabled === false) {
                  speaking = false;
                }
                if (options.after) { options.after(); }
                // Send the new status to remote peers
                DataChannelService.sendStatus(that, {exclude: "picture"});
                
                if (type === 'video') { 
                  // Sending videoPause OR videoResume event to callstats.io
                  jhEventsProvider.emitEvent({
                    type: "video",
                    data: {
                      status: ((enabled === false) ? "paused" : "resumed"),
                      peerconnection: that.connection.pluginHandle.webrtcStuff.pc
                    }
                  });
                } else if (type === 'audio') {
                  // Sending audioMute OR audioUnmute event to callstats.io
                  jhEventsProvider.emitEvent({
                    type: "audio",
                    data: {
                      status: ((enabled === false) ? "muted" : "unmuted"),
                      peerconnection: that.connection.pluginHandle.webrtcStuff.pc
                    }
                  });
                }
              });
            }
          });
          if (type === "video") {
            // Disable the local track in addition to the channel, so it's more
            // obvious for the user that we are not sending video anymore
            this.setEnabledTrack("video", enabled);
          }
        } else if (type === "audio" && enabled === false) {
          DataChannelService.sendMuteRequest(this);
        }
      };

      /**
       * Sets the value of the speaking attribute for this publisher feed,
       * honoring the value of audioEnabled and notifying changes to the
       * remote peers if needed.
       */
      function updateLocalSpeaking(val) {
        $timeout(function() {
          if (that.isEnabled("audio") === false) {
            val = false;
          }
          if (speaking !== val) {
            speaking = val;
            if (val === false) { silentSince = Date.now(); }
            DataChannelService.sendStatus(that, {exclude: "picture"});
          }
        });
      }

      /**
       * Sets the value of the picture attribute for this publisher feed,
       * notifying changes to the remote peers.
       */
      this.updateLocalPic = function(data) {
        var that = this;

        $timeout(function() {
          picture = data;
          DataChannelService.sendStatus(that);
        });
      };
      
      /**
       * Updates the value of the display attribute for this publisher feed,
       * notifying changes to the remote peers.
       */
      this.updateDisplay = function(newDisplay) {
        var that = this;

        $timeout(function() {
          that.setDisplay(newDisplay);
          DataChannelService.sendStatus(that);
        });
      };

      /**
       * Gets the current display name for publisher
       * @return {string} - current display
       */
      this.getDisplay = function() {
        return this.display;
      };
    
      /**
       * Sets the name for publisher 
       * @param {string} - val - new display 
       */
      this.setDisplay = function (val) {
        this.display = val;
      };
      /**
       * Reads the representation of the local feed in order to send it to the
       * remote peers.
       *
       * @param {object} options - use the 'exclude' key to specify a list of
       *        attributes that should not be included (as array of strings)
       * @returns {object} attribute values
       */
      this.getStatus = function(options) {
        options = options || {};
        if (!options.exclude) { options.exclude = []; }

        var attrs = ["audioEnabled", "videoEnabled", "speaking", "picture", "display"];
        var status = {};

        _.forEach(attrs, function(attr) {
          if (!_.includes(options.exclude, attr)) {
            status[attr] = that["get"+_.capitalize(attr)]();
          }
        });
        return status;
      };

      /**
       * Update local representation of the feed (used to process information
       * sent by the remote peer)
       */
      this.setStatus = function(attrs) {
        var that = this;
        $timeout(function() {
          if (speaking === true && attrs.speaking === false) {
            silentSince = Date.now();
          }
          _.forEach(attrs, function(value, attr) {
            that["set"+_.capitalize(attr)](value);
          });
        });
      };

      /**
       * Checks if the feed audio is inactive and, thus, can be hidden or
       * rendered as a stream of pictures instead of a video
       *
       * @returns {boolean}
       */
      this.isSilent = function(threshold) {
        if (!threshold) { threshold = 6000; }
        return !speaking && silentSince < (Date.now() - threshold);
      };

      /**
       * Enables or disables the video of the connection to Janus
       */
      this.setVideoSubscription = function(value) {
        this.connection.setConfig({values: {video: value}});
      };

      /**
       * Gets the status of the video flag of the connection to Janus
       *
       * @returns {boolean}
       */
      this.getVideoSubscription = function() {
        if (this.connection && this.connection.getConfig()) {
          return this.connection.getConfig().video;
        } else {
          return null;
        }
      };

      function getTrack(type) {
        if(stream === null || stream === undefined) {
          return null;
        }
        var func = "get" + _.capitalize(type) + "Tracks";
        if(stream[func]() === null || stream[func]() === undefined) {
          return null;
        }
        var track = stream[func]()[0];
        if(track === undefined) {
          return null;
        }
        return track;
      }
    };
  }
})();
