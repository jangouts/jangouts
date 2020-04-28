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

const NOTIFICATION_SHOW = 'jangouts/notification/SHOW';
const NOTIFICATION_HIDE = 'jangouts/notification/HIDE';

/**
 * Notify that a given event has happened.
 *
 * @see notifications
 */
const notifyEvent = (event) => (dispatch) => {
  const notification = notificationFromEvent(event);
  if (!notification) {
    return null;
  }
  notifier.notify(notification, {}).then(() => {
    dispatch(notificationHide());
  });
  dispatch(notificationShow(notification));
};

const notificationShow = (notification) => ({
  type: NOTIFICATION_SHOW,
  payload: { notification }
});

const notificationHide = () => ({
  type: NOTIFICATION_HIDE
});

const actionCreators = {
  notifyEvent,
  notificationShow,
  notificationHide
};

const actionTypes = {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE
};

const initialState = [];

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_SHOW: {
      const { notification } = action.payload;
      return [...state, notification];
    }
    case NOTIFICATION_HIDE: {
      return state.slice(1);
    }
    default: {
      return state;
    }
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
