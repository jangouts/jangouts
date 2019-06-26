/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

/**
 * This module offers an API to interact with a Janus server.
 *
 * @todo Read configuration.
 */
import server from './server';

// TODO: get this value from the configuration
const defaultUrl = 'ws://localhost:8188/janus';

export default (function () {
  var that = {};

  that.server = server({janusServer: defaultUrl});
  that.getRooms = () => that.server.getRooms();

  return that;
})();
