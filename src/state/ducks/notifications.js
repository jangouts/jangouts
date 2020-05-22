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
import { fromEvent as notificationFromEvent, UserNotification } from '../../utils/notifications';

const NOTIFICATION_SHOW = 'jangouts/notification/SHOW';
const NOTIFICATION_CLOSE = 'jangouts/notification/CLOSE';
const DEFAULT_TIMEOUT = 5000;

/**
 * Notify that a given event has happened.
 *
 * @param [Object] event - Event to notify
 * @param [Number] timeout - Timeout (in miliseconds)
 * @see notifications
 */
const notifyEvent = (event, timeout) => (dispatch) => {
  const notification = notificationFromEvent(event);
  if (notification) {
    dispatch(notify(notification, timeout));
  }
};

/**
 * Notify a message.
 *
 * @param [String] message - Message text
 * @param [String] severity - Message's severity
 * @param [Number] timeout - Timeout (in miliseconds)
 */
const notifyMessage = (text, severity, timeout) => (dispatch) => {
  const notification = new UserNotification(text, severity);
  dispatch(notify(notification, timeout));
};

/**
 * Action to display a notification (and hide it after the timeout)
 *
 * @param [UserNotification] notification - Notification
 * @param [Number] timeout - Timeout (in miliseconds)
 */
const notify = (notification, timeout = DEFAULT_TIMEOUT) => (dispatch) => {
  dispatch(show(notification));
  setTimeout(() => dispatch(close(notification.id)), timeout);
};

const show = (notification) => ({
  type: NOTIFICATION_SHOW,
  payload: { notification }
});

const close = (id) => ({
  type: NOTIFICATION_CLOSE,
  payload: { id }
});

const actionCreators = {
  notifyEvent,
  notifyMessage,
  show,
  close
};

const actionTypes = {
  NOTIFICATION_SHOW,
  NOTIFICATION_CLOSE
};

const initialState = [];

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_SHOW: {
      const { notification } = action.payload;
      return [...state, notification];
    }
    case NOTIFICATION_CLOSE: {
      const { id } = action.payload;
      return state.filter((n) => n.id !== id);
    }
    default: {
      return state;
    }
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
