/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

const streams = {};
const StreamService = {
  /**
   * @returns {MediaStream} gets stream associated to the given id or null if not found
   */
  get: (id) => {
    return streams[id] || null;
  },

  /**
   * Registers a stream, associating it to an id.
   * @param {Integer} id - id under which is registered
   * @param {MediaStream} stream
   */
  add: (id, stream) => {
    streams[id] = stream;
  },

  /**
   * Unregisters the stream associated to the given id.
   */
  delete: (id) => {
    delete streams[id];
  }
};

export default StreamService;
