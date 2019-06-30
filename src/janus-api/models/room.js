/**
 * Copyright (c) [2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This module contains a set of functions to work with rooms.
 */

/**
 * Builds a room
 *
 * @param {Integer} id Room ID
 * @param {String} description Room description
 * @param {Integer} participants How many participants are in the room
 * @param {Integer} publishers Maximum quantity of publishers
 */
export function createRoom(id, description, participants, publishers) {
  return { id, description, participants, publishers };
}

/**
 * Helper method to create a room using data from a Janus server
 *
 * @property {Integer} options.room Room ID
 * @property {Integer} options.description Room description
 * @property {Integer} options.num_participants How many participants are in the room
 * @property {Integer} options.max_publishers Maximum quantity of publishers
 */
export function createRoomFromJanus({ room, description, num_participants, max_publishers }) {
  return createRoom(room, description, num_participants, max_publishers);
}
