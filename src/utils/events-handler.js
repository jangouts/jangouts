/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { actionCreators as actions } from '../state/ducks';

export const createEventsHandler = (dispatchFn) => (event) => {
  const handlers = {
    error: ({ error }) => {
      dispatchFn({ type: 'error' });
    },
    log: ({ data }) => {
      dispatchFn(actions.messages.receive(data));
    },
    addFeed: ({ data }) => {
      dispatchFn(actions.participants.addParticipant(data));
      dispatchFn(actions.participants.autoSetFocus());
    },
    removeFeed: ({ data }) => {
      dispatchFn(actions.participants.removeParticipant(data.feedId));
      dispatchFn(actions.participants.autoSetFocus());
    },
    stream: ({ data }) => {
      dispatchFn(actions.participants.setStream(data.feedId));
    },
    room: (event) => {
      const { status, error } = event.data;
      if (status === 'error') {
        dispatchFn(actions.room.loginFailure(error));
      } else {
        defaultHandler(event);
      }
    },
    statusUpdate: ({ data: { source, status } }) => {
      const { videoEnabled: video, audioEnabled: audio, display, picture } = status;

      dispatchFn(actions.participants.updateStatus(source, { audio, video, display, picture }));
    },
    channel: (event) => {
      const { source, channel, status } = event.data;

      dispatchFn(actions.participants.updateStatus(source, { [channel]: status }));
    },
    // FIXME: it may replace the 'channel' action
    configChanged: ({ data }) => {
      dispatchFn(actions.participants.updateLocalStatus(data));
    },
    participantSpeaking: ({ data }) => {
      const { feedId, speaking } = data;
      dispatchFn(actions.participants.participantSpeaking(feedId, speaking));
      dispatchFn(actions.participants.autoSetFocus());
    },
    muted: (event) => {
      dispatchFn(actions.notifications.notifyEvent(event));
    },
    screenshare: (event) => {
      dispatchFn(actions.notifications.notifyEvent(event));
    }
  };

  const defaultHandler = (event) => {
    console.log('Unhandled event:', event.type, event);
  };

  const handlerFn = handlers[event.type];
  if (handlerFn !== undefined) {
    handlerFn(event);
  } else {
    defaultHandler(event);
  }
};
