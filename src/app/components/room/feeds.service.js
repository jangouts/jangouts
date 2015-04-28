(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('FeedsService', [FeedsService]);

  function FeedsService() {
    this.mainFeed = null;
    this.feeds = {};

    this.find = find;
    this.findMain = findMain;
    this.add = add;
    this.destroy = destroy;
    this.allFeeds = allFeeds;
    this.publisherFeeds = publisherFeeds;

    function find(id) {
      return (this.feeds[id] || null);
    }

    function findMain() {
      return this.mainFeed;
    }

    function add(feed, options) {
      this.feeds[feed.id] = feed;
      if (options && options.main) {
        this.mainFeed = feed;
      }
    }

    function destroy(id) {
      delete this.feeds[id];
      if (id === this.mainFeed.id) {
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
  }

}());
