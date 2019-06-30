/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createEventsService } from './events-service';

describe('#emitEvent', () => {
  test('emits an event with the configured room and user', () => {
    let eventsService = createEventsService();
    const subscriber = jest.fn();
    const event = { type: 'request', data: 'payload' };
    eventsService.setRoom('room1');
    eventsService.setUser('user1');
    eventsService.getEventsSubject().subscribe(subscriber);

    eventsService.emitEvent(event);
    expect(subscriber).toHaveBeenCalledWith({ ...event, user: 'user1', room: 'room1' });
  });
});
