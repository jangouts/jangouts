/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { Janus } from '../vendor/janus';
import { createRoomFromJanus } from './models/room';

/**
 * Returns the Janus server URL from the configuration
 *
 * @param {String} server Janus server URI
 * @param {String} sslServer Janus SSL server URI
 * @param {Boolean} useSSL Whether to use SSL or not
 */
const configuredJanusServer = (server, sslServer, useSSL) =>
      sslServer && useSSL ? sslServer : server;

/**
 * Guess the default janus server
 *
 * @todo it is copied from the old room service. Please, refactor.
 */
const defaultJanusServer = (useSSL) => {
  var wsProtocol;
  var wsPort;

  if (useSSL) {
    wsProtocol = "wss:";
    wsPort = "8989";
  } else {
    wsProtocol = "ws:";
    wsPort = "8188";
  }

  return [
    wsProtocol + '//' + window.location.hostname + ':' + wsPort + '/janus/',
    window.location.protocol + '//' + window.location.hostname + '/janus/'
  ];
};

/**
 * Builds an object to interact with a Janus server
 *
 * @param {Object} config Janus config options
 * @property {String} config.janusServer Janus server URL
 * @property {String} config.janusServerSSL Janus SSL server URL
 * @property {Boolean} config.janusDebug NOT IMPLEMENTED
 * @property {Integer} config.joinUnmutedLimit Feeds limit to connect as unmuted
 * @property {Boolean} config.videThumbnails Use only thumbnails
 * @property {Boolean} config.useSSL Whether to use SSL or not (TODO: autodetect?)
 * @returns {Object}
 */
export default (config) => {
  const { janusServer, janusServerSSL, useSSL } = config;

  var that = {};
  that.server = configuredJanusServer(janusServer, janusServerSSL, useSSL) || defaultJanusServer(useSSL);

  /**
   * Connects to the Janus server
   *
   * @returns {Promise}
   */
  that.connect = () => {
    return new Promise(function(resolve, reject) {
      if (that.janus) {
        resolve(true);
      } else {
        Janus.init();
        console.log(that.server);
        that.janus = new Janus({
          server: that.server,
          success: () => resolve(true),
          error: (e) => {
            // TODO: move this to a better place
            const msg = `Janus error: ${e}. Do you want to reload in order to retry?"`;
            reject();
            if (window.confirm(msg)) {
              window.location.reload();
            }
          },
          destroyed: () => console.log("Janus object destroyed")
        });
      }
    });
  };

  /**
   * Returns the list of rooms from the server
   *
   * This function makes sures that a connection already exists, but the real work is done by the
   * doGetRooms function.
   *
   * @returns {Promise<Array>} List of rooms from the server
   */
  that.getRooms = () => {
    return new Promise((resolve) => {
      that.connect().then(
        () => {
          that.doGetRooms().then((rooms) => resolve(rooms));
        }
      );
    });
  };

  /**
   * Returns the list of rooms from the server
   *
   * @todo This function should be private.
   *
   * @returns {Promise<Array>} List of rooms from the server
   */
  that.doGetRooms = () => {
    return new Promise((resolve, reject) => {
      that.janus.attach({
        plugin: "janus.plugin.videoroom",
        error: (error) => console.error(error),
        success: function(pluginHandle) {
          console.log("getAvailableRooms plugin attached (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");
          const request = { "request": "list" };
          pluginHandle.send({"message": request, success: function(result) {
            // Free the resource (it looks safe to do it here)
            pluginHandle.detach();
            if (result.videoroom === "success") {
              var rooms = result.list.map((r) => createRoomFromJanus(r));
              resolve(rooms);
            } else {
              reject();
            }
          }});
        }
      });
    });
  };

  return that;
}

