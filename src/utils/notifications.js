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
const MUTED_USER = 'user';
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

    case MUTED_USER: {
      return 'You have been muted.';
    }

    default: {
      return null;
    }
  }
};

const textHandlers = {
  muted: mutedText
};

const eventText = (event) => {
  const handlerFn = textHandlers[event.type];
  return handlerFn ? handlerFn(event.data) : null;
};

export const fromEvent = (event) => {
  return new UserNotification(eventText(event), SEVERITY_INFO);
};

export function UserNotification(text, severity = SEVERITY_INFO) {
  this.severity = severity;
  this.text = text;
}
