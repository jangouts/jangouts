/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createLogService } from './log-service';
import { createLogEntry } from './models/log-entry';

const emitEvent = jest.fn();
const eventsService = { emitEvent };

describe('#add', () => {
  test('adds the entry to the log', () => {
    const entry = createLogEntry({});
    let logService = createLogService(eventsService);
    return logService.add(entry).then(() => {
      expect(logService.allEntries()).toStrictEqual([entry]);
      expect(emitEvent).toHaveBeenCalledWith({ type: 'log', data: entry });
    });
  });
});
