/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { actionCreators as actions } from '../../state/ducks';

export const addEventsHandlers = (subject, dispatchFn) => {
  const handlers = {
    error: ({ error }) => {
      dispatchFn({ type: 'error' });
    },
    log: ({ data }) => {
      dispatchFn(actions.messages.receive(data));
    },
    addFeed: ({ data }) => {
      dispatchFn(actions.participants.addParticipant(data));
    },
    removeFeed: ({ data }) => {
      dispatchFn(actions.participants.removeParticipant(data.feedId));
    },
    stream: ({ data }) => {
      dispatchFn(actions.participants.setStream(data.feedId));
    }
  };

  const defaultHandler = (event) => {
    console.log("Unhandled event:", event.type, event);
  };

  function handleEvent(event) {
    const handlerFn = handlers[event.type];
    if (handlerFn !== undefined) {
      handlerFn(event);
    } else {
      defaultHandler(event);
    }
  }

  subject.subscribe(handleEvent);
};
