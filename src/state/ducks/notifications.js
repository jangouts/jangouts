/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This duck provides the Redux pieces to handle notifications.
 *
 * @todo Remember which notifications should be 'silenced'.
 */
import notifier from '../../utils/notifier';
import { fromEvent as notificationFromEvent } from '../../utils/notifications';

/**
 * Notify that a given event has happened.
 *
 * @see notifications
 */
const notifyEvent = (event) => () => {
  const notification = notificationFromEvent(event);
  if (notification) {
    notifier.notify(notification);
  }
};

const actionCreators = {
  notifyEvent
};

export { actionCreators };
