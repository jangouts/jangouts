(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('Feed', ['DataChannelService', feedFactory]);

  function feedFactory(DataChannelService) {
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
        if (this === window.publisherFeed) {
          // FIXME: this is not triggering the button change in the UI
          // Imo, aquí no parece que ng-show y ng-hide se den por aludidos.
          // Sólo funciona si le dimos al botón localmente. Si esta función
          // es llamada como resultado de un setEnabledRemoteTrack, la interfaz
          // no se entera
          var track = getTrack(type);
          track.enabled = enabled;
          this[type + "Enabled"] = enabled;
          this.sendStatus();
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
        // FIXME: this is not triggering the button change in the UI
        // Imo aquí tampoco parece que ng-show y ng-hide se den por aludidos
        _.assign(this, attrs);
        // Just an alternative in case _assign was the culprit
        //var that = this;
        //_.forOwn(attrs, function(val, key) { that[key] = val });
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
          display: that.display,
          trackType: type,
          enabled: enabled
        };

        DataChannelService.sendMessage("setTrackStatusRequest", content);
      }
    };
  }
})();
