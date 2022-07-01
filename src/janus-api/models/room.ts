/**
 * Copyright (c) [2015-2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Represents a Janus room
 */
class Room {
  id: number;
  description: string;
  participants: number;
  publishers: number;
  pinRequired: boolean;

  constructor(
    id: number, description: string, participants: number, publishers: number, pinRequired: boolean
  ) {
    this.id = id;
    this.description = description;
    this.participants = participants;
    this.publishers = publishers;
    this.pinRequired = pinRequired;
  }
}

/**
 * Helper method to create a room using data from a Janus server
 *
 * @property options.room Room ID
 * @property options.description Room description
 * @property options.num_participants How many participants are in the room
 * @property options.max_publishers Maximum quantity of publishers
 * @property options.pin_required Maximum quantity of publishers
 */
export function createRoomFromJanus(
  { room, description, num_participants, max_publishers, pin_required } : {
  room: number,
  description: string,
  num_participants: number,
  max_publishers: number,
  pin_required: boolean
}) {
  return new Room(room, description, num_participants, max_publishers, pin_required);
}
