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
import { fromEvent as notificationFromEvent } from '../../utils/notifications';

const NOTIFICATION_SHOW = 'jangouts/notification/SHOW';
const NOTIFICATION_CLOSE = 'jangouts/notification/CLOSE';

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
  dispatch(show(notification));
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
