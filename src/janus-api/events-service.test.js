/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createEventsService } from './events-service';

describe('#roomEvent', () => {
  test('emits an event using the room subject', () => {
    let eventsService = createEventsService();
    const subscriber = jest.fn();
    eventsService.getRoomSubject().subscribe(subscriber);

    eventsService.roomEvent('event', 'payload');
    expect(subscriber).toHaveBeenCalledWith({event: 'event', payload: 'payload'});
  });
});
