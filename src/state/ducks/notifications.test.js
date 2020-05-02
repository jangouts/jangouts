/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { UserNotification } from '../../utils/notifications';
import reducer, { actionCreators } from './notifications';

const notification = new UserNotification('You have been muted.');
const other_notification = new UserNotification('Nobody is listening!');

describe('reducer', () => {
  it('handles NOTIFICATION_SHOW', () => {
    const action = actionCreators.show(notification);
    expect(reducer([], action)).toEqual([notification]);
  });

  it('handles NOTIFICATION_CLOSE', () => {
    const action = actionCreators.close(notification.id);
    expect(reducer([other_notification, notification], action)).toEqual([other_notification]);
  });
});
