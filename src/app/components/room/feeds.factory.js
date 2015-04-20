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
            that.sendStatus();
          });
        } else {
          // FIXME harmful request should be filtered in the other side
          // Just ensure we don't send a harmful request
          if (type === "audio" && enabled === false) {
            setEnabledRemoteTrack(type, enabled);
          }
        }
      };

      this.setSpeaking = function(speaking) {
        var that = this;
        // We need to use $timeout function just to let AngularJS know
        // about changes in the feed.
        $timeout(function() {
          that.speaking = speaking;
          that.sendStatus();
        });
      }

      this.sendStatus = function() {
        var content = {
          // TODO: Right now it's only useful to send information about
          // publisherFeed. After some refactoring we should be able to send
          // information about any feed
          audioEnabled: that.audioEnabled,
          videoEnabled: that.videoEnabled,
          speaking:     that.speaking,
          display:      that.display
        };

        DataChannelService.sendMessage("statusUpdate", content);
      }

      // Update local representation of the feed (used to process
      // information sent by the remote peer using sendStatus)
      this.updateStatus = function(attrs) {
        // We need to use $timeout function just to let AngularJS know
        // about changes in the feed.
        var that = this;
        $timeout(function() {
          _.assign(that, attrs);
        });
      };

      this.detach = function() {
        this.pluginHandle.detach();
        this.pluginHandle = null;
        this.stream = null;
        this.audioEnabled = true;
        this.videoEnabled = true;
      }

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

      function setEnabledRemoteTrack(type, enabled) {
        var content = {
          target: that.id,
          trackType: type,
          enabled: enabled
        };

        DataChannelService.sendMessage("setTrackStatusRequest", content);
      }
    };
  }
})();
