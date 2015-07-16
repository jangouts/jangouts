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

      this.picture = null;
      this.speaking = false;

      this.waitingForHandle = function() {
        return (this.isIgnored === false && !this.pluginHandle);
      };

      this.configure = function(config) {
        if (this.pluginHandle) {
          config.request = "configure";
          this.pluginHandle.send({"message": config});
        }
      }

      this.setEnabledChannel = function(type, enabled) {
        var that = this;

        if (this.isPublisher) {
          $timeout(function() {
            // Stop/start sending the information on the channel
            var config = {}
            config[type] = enabled;
            that.configure(config);
            // Update the status information
            that[type+'Enabled'] = enabled;
            if (type === 'audio' && enabled === false) {
              that.speaking = false;
            }
            // Send the new status to remote peers
            DataChannelService.sendStatus(that, {exclude: "picture"});
          });
        } else if (type === "audio" && enabled === false) {
          DataChannelService.sendMuteRequest(this);
        }
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
            DataChannelService.sendStatus(that, {exclude: "picture"});
          }
        });
      };

      this.updatePic = function(data) {
        var that = this;

        $timeout(function() {
          that.picture = data;
          DataChannelService.sendStatus(that);
        });
      }

      this.getStatus = function(options) {
        if (!options) { options = {}; }
        if (!options.exclude) { options.exclude = []; }

        var attrs = ["audioEnabled", "videoEnabled", "speaking", "display", "picture"];
        var status = {};

        _.forEach(attrs, function(attr) {
          if (!_.includes(options.exclude, attr)) {
            status[attr] = that[attr];
          }
        });
        return status;
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
