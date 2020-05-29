/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Functions to deal with notifications.
 *
 * @example Turning an event into a notification object
 *   const event = { type: 'muted', { data: { cause: 'user' }}};
 *   const notification = fromEvent(event);
 */
export const SEVERITY_INFO = 'info';
export const SEVERITY_WARN = 'warn';
export const SEVERITY_ERROR = 'error';

const MUTED_JOIN = 'join';
const MUTED_REQUEST = 'request';
let lastId = 0;

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

const textHandlers = {
  muted: mutedText,
  screenshare: screenshareText
};

const eventText = (event) => {
  const handlerFn = textHandlers[event.type];
  return handlerFn ? handlerFn(event.data) : null;
};

/**
 * Turns an event into a user notification.
 *
 * @param {object} event - Event to turn into a notification
 * @return {UserNotification,null} - User notification or null if it is not handled
 */
export const fromEvent = (event) => {
  const text = eventText(event);
  return text ? new UserNotification(text, SEVERITY_INFO, event.type) : null;
};

/**
 * @param {string} text - Notification text
 * @param {string} severity - Notification severity (SEVERITY_INFO, SEVERITY_WARN, SEVERITY_ERROR)
 * @param {string} type - Notification type. Used to classify notifications and blacklisting them.
 */
export function UserNotification(text, severity = SEVERITY_INFO, type = null) {
  this.id = lastId++;
  this.severity = severity;
  this.text = text;
  this.type = type;
}
