/**
 * Copyright (c) [2015-2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Subject } from 'rxjs';

export class EventsService {
  private roomSubject: Subject<object>;

  constructor() {
    this.roomSubject = new Subject();
  }

  /*
   * Subject to which the API user must subscribe in order to react to the
   * emitted events.
   */
  getRoomSubject() {
    return this.roomSubject;
  }

  /*
   *  Emits event in the room subject
   */
  roomEvent(event: object, payload: object) {
    if (this.roomSubject === null || this.roomSubject === undefined) {
      console.error('Event emitter is not configured. Event not emitted');
    } else {
      this.roomSubject.next({event, payload});
    }
  };

  auditEvent(event: object, _payload: object) {
    console.debug('TODO: bring audit events back - ', event);
  };

}

export const createEventsService = () => new EventsService();
