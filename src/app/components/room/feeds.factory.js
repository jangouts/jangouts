/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('Feed', feedFactory);

  feedFactory.$inject = ['$timeout', 'DataChannelService'];

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
      this.isIgnored = attrs.ignored || false;
      this.audioEnabled = attrs.audioEnabled || false;
      this.videoEnabled = attrs.videoEnabled || false;

      this.speaking = false;

      this.waitingForHandle = function() {
        return (this.isIgnored === false && !this.pluginHandle);
      };

      this.configure = function(config, jsep) {
        var that = this;

        config.request = "configure";
        if (jsep) { config.jsep = jsep };
        $timeout(function() {
          that.pluginHandle.send({"message": config});
          if (config.video !== undefined && config.video !== null) {
            that.videoEnabled = config.video;
          }
          if (config.audio !== undefined && config.audio !== null) {
            that.audioEnabled = config.audio;
          }
          DataChannelService.sendStatus(that);
        });
      }

      this.setSpeaking = function(speaking) {
        var that = this;
        // We need to use $timeout function just to let AngularJS know
        // about changes in the feed.
        $timeout(function() {
          if (that.audioEnabled === false) {
            speaking = false;
          }
          if (that.speaking !== speaking) {
            that.speaking = speaking;
            DataChannelService.sendStatus(that);
          }
        });
      };

      this.getStatus = function() {
        return {
          audioEnabled: that.audioEnabled,
          videoEnabled: that.videoEnabled,
          speaking:     that.speaking,
          display:      that.display
        };
      };

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
    };
  }
})();
