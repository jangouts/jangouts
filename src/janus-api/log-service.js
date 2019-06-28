/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

export const createLogService = eventsService => {
  let entries = [];
  let that = {};

  that.add = (entry) => {
    return new Promise((resolve) => {
      entries.push(entry);
      eventsService.emitEvent({ type: 'log', entry });
      resolve();
    });
  };

  that.allEntries = () => entries;

  return that;
};
