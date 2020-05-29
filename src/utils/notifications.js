/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { actionCreators as messageActions } from '../state/ducks/notifications';

/**
 * @param {number} id - Notification ID (unique)
 * @param {string} text - Notification text
 * @param {string} severity - Notification severity (SEVERITY_INFO, SEVERITY_WARN, SEVERITY_ERROR)
 * @param {string} type - Notification type. Used to classify notifications and blacklisting them.
 * @param {array}  actions - Possible actions related to the notification
 */
export function UserNotification(id, text, type, severity, actions) {
  this.id = id;
  this.severity = severity;
  this.text = text;
  this.type = type;
  this.actions = actions;
}

/**
 * Action associated to a notification
 *
 * @param {string} label - Label to display to the user
 * @param {function,object} toDispatch - action creator (function) or action to dispatch (object)
 */
export function Action(label, toDispatch) {
  this.label = label;
  this.toDispatch = toDispatch
}

/**
 * Turns an event into a user notification.
 *
 * @param {object} event - Event to turn into a notification
 * @return {UserNotification,null} - User notification or null if it is not handled
 */
export const fromEvent = ({type, data}) => {
  const factory = eventFactories[type];
  return factory ? factory(data) : null;
};

/**
 * Creates a simple notification
 *
 * @param {string} text - Notification text
 * @param {string} severity - Notification severity (SEVERITY_INFO, SEVERITY_WARN, SEVERITY_ERROR)
 * @param {string} type - Notification type. Used to classify notifications and blacklisting them.
 */
export const createNotification = (text, type, severity = SEVERITY_INFO, actions = []) => {
  return new UserNotification(nextId(), text, type, severity, actions);
}

/**
 * Severity levels
 */
export const SEVERITY_INFO = 'info';
export const SEVERITY_WARN = 'warn';
export const SEVERITY_ERROR = 'error';

/**
 * Notifications types
  */
const MUTED_TYPE = "muted";
const SCREENSHARE_TYPE = "screenshare";

/**
 * Each notification has a unique ID (local to each client).
 */
let lastId = 0;
const nextId = () => lastId++;

/**
 * Factory function to create screen sharing notifications.
 *
 * @param {object} data - Event data
 * @return {UserNotification} - User notification
 */
const createScreenShareNotification = (data) => {
  return createNotification(screenshareText(data), SCREENSHARE_TYPE);
}

const SCREENSHARE_STARTED = 'started';
const SCREENSHARE_STOPPED = 'stopped';

const screenshareText = (data) => {
  switch (data.status) {
    case SCREENSHARE_STARTED: {
      return 'You started sharing your screen.';
    }

    case SCREENSHARE_STOPPED: {
      return 'You stopped sharing your screen.';
    }

    default: {
      return null;
    }
  }
};

/**
 * Factory function to create notifications about users being 'muted'.
 *
 * @param {object} data - Event data
 * @return {UserNotification} - User notification
 */
const createMutedNotification= (data) => {
  const notification = createNotification(mutedText(data), MUTED_TYPE);
  notification.actions = [
    new Action("Do not show again", messageActions.blacklist(MUTED_TYPE))
  ];
  return notification;
}

const MUTED_JOIN = 'join';
const MUTED_REQUEST = 'request';

const mutedText = (data) => {
  switch (data.cause) {
    case MUTED_JOIN: {
      let text = 'You are muted because ';
      if (data.limit === 0) {
        text += 'everyone who enters a room is muted by default.';
      } else {
        text += `there are already ${data.limit} participants in the room.`;
      }
      return text;
    }

    case MUTED_REQUEST: {
      const { display } = data.source;
      return `You have been muted by ${display}.`;
    }

    default: {
      return null;
    }
  }
};

const eventFactories = {
  muted: createMutedNotification,
  screenshare: createScreenShareNotification
};
