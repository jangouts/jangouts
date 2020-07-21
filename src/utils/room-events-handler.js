/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { actionCreators as actions } from '../state/ducks';
import DOMPurify from 'dompurify';

export const createRoomEventsHandler = (dispatchFn) => ({event, payload}) => {
  const handlers = {

    createFeed: (data) => {
      dispatchFn(actions.participants.addParticipant(data));
      dispatchFn(actions.participants.autoSetFocus());
      if (!data.local) {
        dispatchFn(actions.messages.add('newRemoteFeed', data));
      }
    },
    createStream: (data) => {
      dispatchFn(actions.participants.setStream(data.feedId, data.stream));
    },
    updateFeed: (data) => {
      dispatchFn(actions.participants.updateStatus(data.id, data));
      dispatchFn(actions.participants.autoSetFocus());
    },
    createChatMsg: (data) => {
      const sanitized = DOMPurify.sanitize(data.text);
      if (sanitized !== '') {
        dispatchFn(actions.messages.addChatMsg(data.feedId, sanitized));
      }
    },
    speakDetection: ({ speaking }) => {
      dispatchFn(actions.participants.localSpeak(speaking));
    },
    muteFeed: (data) => {
      dispatchFn(actions.participants.requestMute(data));
    },
    destroyParticipant: ({ id }) => {
      dispatchFn(actions.participants.removeParticipant(id));
      dispatchFn(actions.participants.autoSetFocus());
    },
    reportError: ({ error }) => {
      dispatchFn({ type: 'error' });
    },
  };

  const defaultHandler = (event, payload) => {
    console.debug('Unhandled event:', event, payload);
  };

  const handlerFn = handlers[event];
  if (handlerFn !== undefined) {
    handlerFn(payload);
  } else {
    defaultHandler(event, payload);
  }
};
