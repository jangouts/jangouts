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
    return function(pluginHandle, wantedInit, jsep, ok) {
      var current = {};
      var requested = null;
      var wanted = {audio: false, video: true};
      var okCallback = null;
      _.assign(wanted, wantedInit);
      // Initial configure
      configure({jsep: jsep, ok: ok});

      /**
       * Gets the current value of the configuration flags
       *
       * @returns {object} values of the audio and video flags
       */
      this.get = function() {
        return current;
      };

      /**
       * Sets the desired value of the configuration flags.
       *
       * It sends a configure request to the Janus server to sync the values
       * if needed (and updates the local representation according).
       *
       * @param {object} options - object containing
       *        * values: object with the wanted values for the flags
       *        * ok: callback to execute on confirmation from Janus
       */
      this.set = function(options) {
        options = options || {};
        options.values = options.values || {};
        var oldWanted = {};
        _.assign(oldWanted, current, wanted);
        _.assign(wanted, current, options.values);

        if (requested === null && differsFromWanted(oldWanted)) {
          configure({ok: options.ok});
        }
      };

      /**
       * Processes the confirmation (received from Janus) of the ongoing
       * config request
       */
      this.confirm = function() {
        $timeout(function() {
          if (requested === null) {
            console.error("I haven't sent a config. Where does this confirmation come from?");
          } else {
            current = requested;
            requested = null;
            console.log("Connection configured", current);
            if (okCallback) { okCallback(); }
            if (differsFromWanted(current)) {
              configure();
            }
          }
        });
      };

      function differsFromWanted(obj) {
        return (obj.video !== wanted.video || obj.audio !== wanted.audio);
      }

      function configure(options) {
        options = options || {};
        var config = {request: "configure"};
        requested = {};

        _.assign(requested, current, wanted);
        _.assign(config, requested);

        pluginHandle.send({
          "message": config,
          jsep: options.jsep,
          success: function() {
            okCallback = options.ok;
          },
          error: function() {
            requested = null;
            console.error("Config request not sent");
          }
        });
      }
    };
  }
})();
