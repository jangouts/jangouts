/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

export const addEventsHandlers = (subject, dispatchFn) => {
  const handlers = {
    error: ({error}) => {
      dispatchFn({type: "error"});
    }
  };

  function handleEvent(event) {
    const handlerFn = handlers[event.type];
    if (handlerFn !== undefined) {
      handlerFn(event);
    }
  }

  subject.subscribe(handleEvent);
};
