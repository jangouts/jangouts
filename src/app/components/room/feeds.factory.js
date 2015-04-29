(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('Feed', ['$timeout', 'DataChannelService', feedFactory]);

  function feedFactory($timeout, DataChannelService) {
    return function(attrs) {
      attrs = attrs || {};
      var that = this;

      this.id = attrs.id || 0;
      this.display = attrs.display || null;
      this.pluginHandle = attrs.pluginHandle || null;
      this.stream = attrs.stream || null;
      this.isPublisher = attrs.isPublisher || false;
      this.isDataOpen = attrs.isDataOpen || false;
      this.isLocalScreen = attrs.isLocalScreen || false;

      this.audioEnabled = true;
      this.videoEnabled = true;
      this.speaking = false;

      this.setEnabledTrack = function(type, enabled) {
        var that = this;
        if (this.isPublisher) {
          // We need to use $timeout function just to let AngularJS know
          // about changes in the feed.
          $timeout(function() {
            var track = getTrack(type);
            track.enabled = enabled;
            that[type + "Enabled"] = enabled;
            DataChannelService.sendStatus(that);
          });
        } else {
          if (type === "audio" && enabled === false) {
            DataChannelService.sendMuteRequest(this);
          }
        }
      };

      this.setSpeaking = function(speaking) {
        var that = this;
        // We need to use $timeout function just to let AngularJS know
        // about changes in the feed.
        $timeout(function() {
          that.speaking = speaking;
          DataChannelService.sendStatus(that);
        });
      }

      this.getStatus = function() {
        return {
          audioEnabled: that.audioEnabled,
          videoEnabled: that.videoEnabled,
          speaking:     that.speaking,
          display:      that.display
        };
      }

      // Update local representation of the feed (used to process
      // information sent by the remote peer)
      this.setStatus = function(attrs) {
        // We need to use $timeout function just to let AngularJS know
        // about changes in the feed.
        var that = this;
        $timeout(function() {
          _.assign(that, attrs);
        });
      };

      this.hasAudio = function() {
        var that = this;
        return (getTrack('audio') !== null);
      }

      this.hasVideo = function() {
        var that = this;
        return (getTrack('video') !== null);
      }

      function getTrack(type) {
        if(that.stream === null || that.stream === undefined) {
          return null;
        }
        var func = "get" + _.capitalize(type) + "Tracks";
        if(that.stream[func]() === null || that.stream[func]() === undefined) {
          return null;
        }
        var track = that.stream[func]()[0];
        if(track === undefined) {
          return null;
        }
        return track;
      }
    };
  }
})();
