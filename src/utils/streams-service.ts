/**
 * Copyright (c) [2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Class to hold media streams indexed by feed ID.
 */
export class StreamsService {
  streams: { [key: number]: MediaStream } = {};

  /**
   * @returns {MediaStream} gets stream associated to the given id or null if not found
   */
  get(id: number): MediaStream | null {
    return this.streams[id] || null;
  }

  /**
   * Registers a stream, associating it to an id.
   * @param id - id under which is registered
   * @param stream - stream to register
   */
  add(id: number, stream: MediaStream) {
    this.streams[id] = stream;
  }

  /**
   * Unregisters the stream associated to the given id.
   */
  delete(id: number) {
    delete this.streams[id];
  }
};

export default new StreamsService();
