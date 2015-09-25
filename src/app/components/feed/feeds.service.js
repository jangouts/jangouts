/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('FeedsService', FeedsService);

  FeedsService.$inject = ['$q'];

  function FeedsService($q) {
    this.mainFeed = null;
    this.feeds = {};

    this.find = find;
    this.findMain = findMain;
    this.add = add;
    this.destroy = destroy;
    this.allFeeds = allFeeds;
    this.publisherFeeds = publisherFeeds;
    this.localScreenFeeds = localScreenFeeds;
    this.speakingFeed = speakingFeed;
    this.waitFor = waitFor;

    function find(id) {
      return (this.feeds[id] || null);
    }

    function findMain() {
      return this.mainFeed;
    }

    /**
     * Find a feed but, if not found, waits until it appears
     *
     * @param {string} id       Feed's id
     * @param {number} attempts Max number of attempts
     * @param {number} timeout  Time (in miliseconds) between attempts
     * @return {Object}         Promise to be resolved when the feed is found.
     */
    function waitFor(id, attempts, timeout) {
      var deferred = $q.defer();
      var feed = this.find(id);
      var that = this;
      attempts = attempts || 10;
      timeout = timeout || 1000;

      if (feed === null) { // If feed is not found, set an interval to check again.
        var interval = setInterval(function () {
          feed = that.find(id);
          if (feed === null) { // The feed was not found this time
            attempts -= 1;
          } else { // The feed was finally found
            clearInterval(interval);
            deferred.resolve(feed);
          }
          if (attempts === 0) { // No more attempts left and feed was not found
            clearInterval(interval);
            deferred.reject("feed with id " + id + " was not found");
          }
        }, timeout);
      } else {
        deferred.resolve(feed);
      }

      return deferred.promise;
    }

    function add(feed, options) {
      this.feeds[feed.id] = feed;
      if (options && options.main) {
        this.mainFeed = feed;
      }
    }

    function destroy(id) {
      delete this.feeds[id];
      if (this.mainFeed && (id === this.mainFeed.id)) {
        this.mainFeed = null;
      }
    }

    function allFeeds() {
      return _.values(this.feeds);
    }

    function publisherFeeds() {
      return _.filter(this.allFeeds(), function (f) {
        return f.isPublisher;
      });
    }

    function localScreenFeeds() {
      return _.filter(this.allFeeds(), function (f) {
        return f.isLocalScreen;
      });
    }

    function speakingFeed() {
      return _.detect(this.allFeeds(), function (f) {
        return f.getSpeaking();
      });
    }
  }

}());
