import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it,
  fakeAsync,
  tick
} from "@angular/core/testing";

import { FeedsService } from "./feeds.service";
import { Feed } from "./feeds.factory";

describe("Service: FeedsService", () => {

  let feeds: FeedsService;

  beforeEachProviders(() => {
    return [
      FeedsService
    ];
  });

  beforeEach(() => {
    feeds = new FeedsService();
  });


  describe("find", () => {
    it("should return null when not feed added", () => {
      expect(feeds.find(1)).toBe(null);
    });

    it("should return null when feed doesn't exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 3});
      feeds.add(feed);

      expect(feeds.find(1)).toBe(null);
    });

    it("should return the feed when exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 1});
      feeds.add(feed);

      expect(feeds.find(1)).toBe(feed);
    });

  });

  describe("findMain", () => {
    it("should return null when not feed added", () => {
      expect(feeds.findMain()).toBe(null);
    });

    it("should return null when main feed doesn't exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 3});
      feeds.add(feed);

      expect(feeds.findMain()).toBe(null);
    });

    it("should return the main feed when exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 1});
      feeds.add(feed, {main: true});

      expect(feeds.findMain()).toBe(feed);
    });
  });

  describe("allFeeds",  () => {
    it("should return and empty array when not feeds added", () => {
      expect(feeds.allFeeds().length).toBe(0);
    });

    it("should an array with all the feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isPublisher: true});
      feeds.add(feed1);
      feeds.add(feed2);
      feeds.add(feed3);

      expect(feeds.allFeeds().length).toBe(3);
    });

  });

  describe("publisherFeeds",  () => {
    it("should return an empty array when not feeds added", () => {
      expect(feeds.publisherFeeds().length).toBe(0);
    });

    it("should an empty array when not publisher feed added", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      feeds.add(feed1);
      feeds.add(feed2);

      expect(feeds.publisherFeeds().length).toBe(0);
    });


    it("should return an array with all publisher feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isPublisher: true});
      feeds.add(feed1);
      feeds.add(feed2);
      feeds.add(feed3);

      expect(feeds.publisherFeeds().length).toBe(1);
    });

  });

  describe("localScreenFeeds",  () => {
    it("should return an empty array when not feeds added", () => {
      expect(feeds.localScreenFeeds().length).toBe(0);
    });

    it("should an empty array when not localScreen feed added", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      feeds.add(feed1);
      feeds.add(feed2);

      expect(feeds.localScreenFeeds().length).toBe(0);
    });


    it("should return an array with all localScreen feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isLocalScreen: true});
      feeds.add(feed1);
      feeds.add(feed2);
      feeds.add(feed3);

      expect(feeds.localScreenFeeds().length).toBe(1);
    });

  });

  describe("speakingFeed",  () => {
    it("should return undefined when not feeds added", () => {
      expect(feeds.speakingFeed()).not.toBeDefined();
    });

    it("should call getSpeaking method in feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      feeds.add(feed1);
      spyOn(feed1, "getSpeaking");

      feeds.speakingFeed();

      expect(feed1.getSpeaking).toHaveBeenCalled();
    });



    it("should return undefined when not speaking feed", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      feeds.add(feed1);
      feeds.add(feed2);
      spyOn(feed1, "getSpeaking").and.returnValue(false);
      spyOn(feed2, "getSpeaking").and.returnValue(false);

      expect(feeds.speakingFeed()).not.toBeDefined();
    });


    it("should an array with all speaking feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isLocalScreen: true});
      feeds.add(feed1);
      feeds.add(feed2);
      feeds.add(feed3);
      spyOn(feed1, "getSpeaking").and.returnValue(false);
      spyOn(feed2, "getSpeaking").and.returnValue(false);
      spyOn(feed3, "getSpeaking").and.returnValue(true);

      expect(feeds.speakingFeed()).toBe(feed3);
    });

  });

  describe("waitFor",  () => {
    it("should call feeds.find with passed id", () => {
      spyOn(feeds, "find");

      feeds.waitFor(1);

      expect(feeds.find).toHaveBeenCalled();
    });

    it("should call feeds.find attemps + 1 times", <any>fakeAsync((): void => {
      spyOn(feeds, "find").and.returnValue(null);

      feeds.waitFor(1, 5, 10);

      tick(10);
      tick(10);
      tick(10);
      tick(10);
      (<any>feeds.find).and.callFake((): Feed => {
        let feed: Feed = new Feed();
        feed.setAttrs({id: 1});
        return feed;
      });
      tick(10);

      expect((<any>feeds.find).calls.count()).toBe(6);
    }));



  });

});
