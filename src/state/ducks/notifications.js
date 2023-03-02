/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This duck provides the Redux pieces to handle notifications.
 */
import { fromEvent as notificationFromEvent } from '../../utils/notifications';

const NOTIFICATION_SHOW = 'jangouts/notification/SHOW';
const NOTIFICATION_CLOSE = 'jangouts/notification/CLOSE';
const NOTIFICATION_BLOCK = 'jangouts/notification/BLOCK';
const NOTIFICATION_UNBLOCK = 'jangouts/notification/UNBLOCK';
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

const NOTIFY_DEFAULT_OPTIONS = {
  timeout: DEFAULT_TIMEOUT,
  block: false
};
/**
 * Action to display a notification (and hide it after the timeout)
 *
 * @param [UserNotification] notification - Notification to show
 * @param [Number] timeout - Timeout (in miliseconds)
 * @param [Number, bool] block - Block this type of notifications
 *   When a number is given, it represents the time (in miliseconds)
 *   until this kind of types are allowed again.
 *   If it is set to 'true', they will block them indefinitely.
 */
const notify = (notification, options) => (dispatch, getState) => {
  const { notifications: state } = getState();
  if (isBlocked(notification.type, state)) return;

  const { timeout, block } = {...NOTIFY_DEFAULT_OPTIONS, ...options};
  const blockExpiration = (typeof(block) === "number") ? Date.now() + block : block;
  dispatch(show(notification, blockExpiration));
  setTimeout(() => dispatch(close(notification.id)), timeout);
};

/**
 * Action to display a notification
 *
 * @param [UserNotification] notification - Notification to show
 * @param [Number, bool] block - Block this type of notifications
 * @return [Object] Action to display the notification
  */
const show = (notification, block) => ({
  type: NOTIFICATION_SHOW,
  payload: { notification, block }
});

/**
 * Action to close a notification
 *
 * @param [Number] id - notification ID
 * @return [Object] Action to close the notification
 */
const close = (id) => ({
  type: NOTIFICATION_CLOSE,
  payload: { id }
});

/**
 * Action to block a notification type
 *
 * @param [String] type - notification type
 * @return [Object] Action to block the given type of notifications
 */
const block = (type) => ({
  type: NOTIFICATION_BLOCK,
  payload: { type }
});

/**
 * Action to unblock a notification type
 *
 * @param [String] type - notification type
 * @return [Object] Action to unblock the given type of notifications
 */
const unblock = (type) => ({
  type: NOTIFICATION_UNBLOCK,
  payload: { type }
});

/**
 * Action to dispatch a notification action
 *
 * @param [Number] id - related notification ID
  * @param [Object] action - action to dispatch
 */
const dispatchAction = (id, action) => (dispatch) => {
  dispatch(action);
  dispatch(close(id));
};

/**
 * Determines whether a notification type is blocked
 *
 * @param [String] type - notification type
 * @param [Object] state - current state
 * @return [boolean]
 */
const isBlocked = (type, state) => {
  const block = state.blocklist[type] || false;
  if (typeof(block) === "number") {
    return block > Date.now();
  }
  return block;
};

/**
 * Helper function to add a type to the blocklist
 *
 * @param [String] type - Notification type
 * @param [Number, true] block - Block this type of notifications
 * @param [Object] state - Original state
 * @return [Object] state without the blocklist
 */
const addTypeToBlocklist = (type, block, state) => {
  return {...state, blocklist: {...state.blocklist, [type]: block}};
};

/**
 * Helper function to remove a type from the blocklist
 *
 * @param [String] type - Notification type
 * @param [Object] state - Original state
 * @return [Object] state without the blocklist
 */
const removeTypeFromBlocklist = (type, state) => {
  const {[type]: _v, ...blocklist } = state.blocklist;
  return {...state, blocklist};
};

const actionCreators = {
  notifyEvent,
  show,
  close,
  block,
  unblock,
  dispatchAction
};

const actionTypes = {
  NOTIFICATION_SHOW,
  NOTIFICATION_CLOSE,
  NOTIFICATION_BLOCK
};

const initialState = { notifications: [], blocklist: {} };

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_SHOW: {
      const { notification, block } = action.payload;
      const newState = {...state, notifications: [...state.notifications, notification] };
      if (block) {
        return addTypeToBlocklist(notification.type, block, newState);
      } else {
        return removeTypeFromBlocklist(notification.type, newState);
      }
    }

    case NOTIFICATION_CLOSE: {
      const { id } = action.payload;
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {...state, notifications };
    }

    case NOTIFICATION_BLOCK: {
      const { type } = action.payload;
      return addTypeToBlocklist(type, true, state);
    }

    case NOTIFICATION_UNBLOCK: {
      const { type } = action.payload;
      return removeTypeFromBlocklist(type, state);
    }

    default: {
      return state;
    }
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
