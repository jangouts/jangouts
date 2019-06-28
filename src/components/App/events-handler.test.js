/**
 * Copyright (c) [2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { addEventsHandlers } from './events-handler';
import { Subject } from 'rxjs';

test('handles error events', () => {
  const dispatchFn = jest.fn();
  const subject = new Subject();
  addEventsHandlers(subject, dispatchFn);
  subject.next({type: "error"});
  expect(dispatchFn).toHaveBeenCalledWith({type: "error"});
});
