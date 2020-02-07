/**
 * Copyright (c) [2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Subject } from 'rxjs';

export default (function() {
  return {
    setup: () => true,
    getEventsSubject: () => new Subject(),
    sendMessage: (text) => 'text',
    getRooms: () =>
      Promise.resolve([
        { id: 1, description: 'Test room', num_participants: 5, max_publishers: 10 }
      ]),
    getFeedStream: (feedId) => (feedId == 1 ? { id: 'someid', active: true } : null),
    enterRoom: (room, username) => Promise.resolve()
  };
})();
