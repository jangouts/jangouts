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

      this.audioEnabled = true;
      this.videoEnabled = true;

      this.setEnabledTrack = function(type, enabled) {
        var that = this;
        if (this === window.publisherFeed) {
          // We need to use $timeout function just to let AngularJS know
          // about changes in the feed.
          $timeout(function() {
            var track = getTrack(type);
            track.enabled = enabled;
            that[type + "Enabled"] = enabled;
            that.sendStatus();
          });
        } else {
          setEnabledRemoteTrack(type, enabled);
        }
      };

      this.sendStatus = function() {
        var content = {
          audioEnabled: that.audioEnabled,
          videoEnabled: that.videoEnabled
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
