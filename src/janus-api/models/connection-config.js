/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Creates a connection config object which handles the status of the configuration
 * flags.
 *
 * @param {Object} pluginHandle Janus plugin handle
 * @param {Object} wantedInit Initial flags values
 * @param {Object} jsep
 * @param {Function} ok Callback to call on success
 */
export const createConnectionConfig = function(pluginHandle, wantedInit, jsep, ok) {
  var current = {};
  var requested = null;
  var wanted = { audio: true, video: true, data: true };
  var okCallback = null;
  Object.assign(wanted, wantedInit);
  // Initial configure
  configure({ jsep: jsep, ok: ok });
  let that = {};

  /**
   * Gets the current value of the configuration flags
   *
   * @returns {object} values of the audio and video flags
   */
  that.get = function() {
    return current;
  };

  /**
   * Sets the desired value of the configuration flags.
   *
   * It sends a configure request to the Janus server to sync the values
   * if needed (and updates the local representation according).
   *
   * @param {object} options options
   * @property {object} options.values object with the wanted values for the flags
   * @property {Boolean} options.values.audio audio flag
   * @property {Boolean} options.values.audio video flag
   * @property {Boolean} options.values.audio data flag
   * @param {Function} ok callback to execute on confirmation from Janus
   */
  that.set = function(options) {
    options = options || {};
    options.values = options.values || {};
    var oldWanted = {};
    Object.assign(oldWanted, current, wanted);
    Object.assign(wanted, current, options.values);

    if (requested === null && differsFromWanted(oldWanted)) {
      configure({ ok: options.ok });
    }
  };

  /**
   * Processes the confirmation (received from Janus) of the ongoing
   * config request
   *
   * The confirmation is received through the janusApi.server module.
   */
  that.confirm = function() {
    return new Promise(function(resolve, reject) {
      if (requested === null) {
        console.error("I haven't sent a config. Where does this confirmation come from?");
        reject();
      } else {
        current = requested;
        requested = null;
        console.debug('Connection configured', current);
        if (okCallback) {
          okCallback(current);
        }
        if (differsFromWanted(current)) {
          configure();
        }
        resolve();
      }
    });
  };

  that.offlineConfirm = function() {
    current = requested;
    requested = null;
  };

  function differsFromWanted(obj) {
    return obj.video !== wanted.video || obj.audio !== wanted.audio;
  }

  function configure(options) {
    options = options || {};
    var config = { request: 'configure' };
    requested = {};

    Object.assign(requested, current, wanted);
    Object.assign(config, requested);

    pluginHandle.send({
      message: config,
      jsep: options.jsep,
      success: function() {
        okCallback = options.ok;
      },
      error: function() {
        requested = null;
        console.error('Config request not sent');
      }
    });
  }

  return that;
};
