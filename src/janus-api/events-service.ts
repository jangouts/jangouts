/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Subject } from 'rxjs';

export const createEventsService = () => {
  let roomSubject = null;
  // object to return
  let that = {};

  /*
   * Subject to which the API user must subscribe in order to react to the
   * emitted events.
   */
  that.getRoomSubject = function() {
    return roomSubject;
  };

  /*
   *  Emits event in the room subject
   */
  that.roomEvent = function(event, payload) {
    if (roomSubject === null || roomSubject === undefined) {
      console.error('Event emitter is not configured. Event not emitted');
    } else {
      roomSubject.next({event, payload});
    }
  };

  that.auditEvent = function(event, payload) {
    console.debug('TODO: bring audit events back - ', event);
  };

  /*
   * Initializes the events system.
   */
  const initSubjects = function() {
    roomSubject = new Subject();
    if (roomSubject === null || roomSubject === undefined) {
      console.error('Could not load rx.js! Event emitter will not work.');
    }
  };

  initSubjects();
  return that;
};
