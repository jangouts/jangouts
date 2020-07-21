/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

export const createFeedsService = (eventsService) => {
  let mainFeed = null;
  let feeds = {};
  let that = {};

  /**
   * @returns {Feed} gets feed with given id or null if not found
   */
  that.find = function(id) {
    return feeds[id] || null;
  };

  /**
   * @returns {Feed} gets main feed or null if not found
   */
  that.findMain = function() {
    return mainFeed;
  };

  /**
   * Find a feed but, if not found, waits until it appears
   *
   * @param {string} id             Feed's id
   * @param {number} [attempts=10]  Max number of attempts
   * @param {number} [timeout=1000] Time (in miliseconds) between attempts
   * @return {Object}               Promise to be resolved when the feed is found.
   */
  that.waitFor = function(id, attempts, timeout) {
    return new Promise((resolve, reject) => {
      let feed = that.find(id);
      attempts = attempts || 10;
      timeout = timeout || 1000;

      if (feed === null) {
        // If feed is not found, set an interval to check again.
        let interval = window.setTimeout(function() {
          feed = that.find(id);
          if (feed === null) {
            // The feed was not found this time
            attempts -= 1;
          } else {
            // The feed was finally found
            window.clearInterval(interval);
            resolve(feed);
          }
          if (attempts === 0) {
            // No more attempts left and feed was not found
            window.clearInterval(interval);
            reject('feed with id ' + id + ' was not found');
          }
        }, timeout);
      } else {
        resolve(feed);
      }
    });
  };

  /**
   * Registers feed.
   * @param {Feed} feed - to register
   * @param {Integer} feed.id - id under which is id registered
   * @param {Array} options - options with feed details
   * @param {Boolean} options.main - if feed is main one
   */
  that.add = function(feed, options) {
    let local = false;

    feeds[feed.id] = feed;
    if (options && options.main) {
      mainFeed = feed;
      local = true;
    }
    eventsService.roomEvent('createParticipant', { id: feed.id, name: feed.getDisplay(), local });
    eventsService.roomEvent('createFeed', { participantId: feed.id, ...feed.apiObject() });
  };

  /**
   * Unregisters feed with given id.
   */
  that.destroy = function(id) {
    delete feeds[id];
    eventsService.roomEvent('destroyFeed', { id });
    eventsService.roomEvent('destroyParticipant', { id });
    if (mainFeed && id === mainFeed.id) {
      mainFeed = null;
    }
  };

  /**
   * @returns {Array<Feed>} all registered feeds
   */
  that.allFeeds = function() {
    return Object.values(feeds);
  };

  /**
   * @returns {Array<Feed>} all registered publisher feeds
   */
  that.publisherFeeds = function() {
    return that.allFeeds().filter((f) => f.getPublisher());
  };

  /**
   * @returns {Array<Feed>} all registered feeds sharing local screen
   */
  that.localScreenFeeds = function() {
    return that.allFeeds().filter((f) => f.getLocalScreen());
  };

  /**
   * @returns {Feed} registered feed that speaks or null
   */
  that.speakingFeed = function() {
    return that.allFeeds().find((f) => f.getSpeaking());
  };

  return that;
};
