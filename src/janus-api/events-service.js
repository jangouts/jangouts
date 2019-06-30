/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Subject } from 'rxjs';

export const createEventsService = () => {
  // User currently logged in
  let user = null;
  // Room currently in use
  let room = null;
  // eventsSubject stores a reference to window.Rx object
  let eventsSubject = null;
  // object to return
  let that = {};

  /*
   * Sets the information about the current signed-in user that will be
   * appended as status information to all the emitted messages.
   */
  that.setUser = function(value) {
    user = value;
  };

  /*
   * Sets the information about the room currently in use that will be
   * appended as status information to all the emitted messages.
   */
  that.setRoom = function(value) {
    room = value;
  };

  /*
   * Subject to which the plugins must subscribe in order to react to the
   * emitted events.
   */
  that.getEventsSubject = function() {
    return eventsSubject;
  };

  /**
   *  Emits event after adding timestamp and status information to it
   *  @param {object} event - carries 'type' and 'data' for event
   */
  that.emitEvent = function(event) {
    event.user = user;
    event.room = room;
    // timestamp shows the time when event gets emitted
    event.timestamp = Date.now();
    if (eventsSubject === null || eventsSubject === undefined) {
      console.warn('Event emitter is not configured. Event not emitted');
    } else {
      eventsSubject.next(event);
    }
  };

  /*
   * Initializes the events system.
   */
  const initEventsSubject = function() {
    eventsSubject = new Subject();
    if (eventsSubject === null || eventsSubject === undefined) {
      console.error('Could not load rx.js! Event emitter will not work.');
    }
  };

  initEventsSubject();
  return that;
};
