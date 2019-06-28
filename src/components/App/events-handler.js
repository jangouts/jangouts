/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { actionCreators as actions } from '../../state/ducks';

export const addEventsHandlers = (subject, dispatchFn) => {
  const handlers = {
    error: ({error}) => {
      dispatchFn({type: 'error'});
    },
    log: (event) => {
      dispatchFn(actions.messages.receive(event.entry));
    },
    addFeed: (event) => {
      dispatchFn(actions.participants.addParticipant(event.feed));
    },
    removeFeed: (event) => {
      dispatchFn(actions.participants.removeParticipant(event.feedId));
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
