/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import notifier from '../../utils/notifier';
import { UserNotification } from '../../utils/notifications';
import reducer, { actionTypes, actionCreators } from './notifications';

const notification = new UserNotification('some text');

describe('reducer', () => {
  it('handles NOTIFICATION_SHOW', () => {
    const action = actionCreators.notificationShow(notification);
    expect(reducer([], action)).toEqual([notification]);
  });

  it('handles NOTIFICATION_HIDE', () => {
    const action = actionCreators.notificationHide(notification);
    expect(reducer([notification], action)).toEqual([]);
  });
});
