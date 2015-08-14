/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('ConnectionConfig', connectionConfigFactory);

  connectionConfigFactory.$inject = ['$timeout'];

  /**
   * Handles the status of the configuration flags (audio and video) of the
   * connection to Janus keeping them synced client and server side.
   *
   * It handles correctly several consequent changes of the flag values
   * keeping the number of requests to a minimum.
   */
  function connectionConfigFactory($timeout) {
    return function(pluginHandle, wanted, jsep) {
      var that = this;

      this.pluginHandle = pluginHandle;
      this.current = {};
      this.requested = null;
      this.wanted = {audio: true, video: true};
      _.assign(this.wanted, wanted);
      // Initial configure
      configure({jsep: jsep});

      /**
       * Gets the current value of the configuration flags
       *
       * @returns {object} values of the audio and video flags
       */
      this.get = function() {
        return this.current;
      };

      /**
       * Sets the desired value of the configuration flags.
       *
       * It sends a configure request to the Janus server to sync the values
       * if needed (and updates the local representation according).
       *
       * @param {object} options - object containing
       *        * values: object with the wanted values for the flags
       *        * success: callback
       *        * error: callback
       */
      this.set = function(options) {
        options = options || {};
        options.values = options.values || {};
        var oldWanted = {};
        _.assign(oldWanted, this.current, this.wanted);
        _.assign(this.wanted, this.current, options.values);

        if (that.requested === null && differsFromWanted(oldWanted)) {
          configure({success: options.success, error: options.error});
        }
      };

      function success() {
        $timeout(function() {
          that.current = that.requested;
          that.requested = null;
          if (differsFromWanted(that.current)) {
            configure();
          }
        });
      }

      function error() {
        $timeout(function() {
          that.requested = null;
          if (differsFromWanted(that.current)) {
            configure();
          }
        });
      }

      function differsFromWanted(obj) {
        return (obj.video !== that.wanted.video || obj.audio !== that.wanted.audio);
      }

      function configure(options) {
        options = options || {};
        var config = {request: "configure"};
        that.requested = {};

        _.assign(that.requested, that.current, that.wanted);
        _.assign(config, that.requested);

        that.pluginHandle.send({
          "message": config,
          jsep: options.jsep,
          success: function() {
            success();
            if (options.success) { options.success(); }
          },
          error: function() {
            error();
            if (options.error) { options.error(); }
          }
        });
      }
    };
  }
})();
