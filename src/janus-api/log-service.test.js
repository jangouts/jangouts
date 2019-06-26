/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { createLogService } from './log-service';
import { createLogEntry } from './models/log-entry';

describe('#add', () => {
  test('adds the entry to the log', () => {
    const entry = createLogEntry({});
    let logService = createLogService();
    return logService.add(entry).then(() => {
      expect(logService.allEntries()).toStrictEqual([entry]);
    });
  });
});
