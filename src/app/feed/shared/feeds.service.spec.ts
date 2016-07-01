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
import { Feed } from "./feed.model";

declare const spyOn;

describe("Service: FeedsService", () => {

  beforeEachProviders(() => {
    return [
      {provide: FeedsService, useClass: FeedsService}
    ];
  });

  beforeEach(() => {
    this.feeds = new FeedsService();
  });


  describe("find", () => {
    it("should return null when not feed added", () => {
      expect(this.feeds.find(1)).toBe(null);
    });

    it("should return null when feed doesn't exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 3});
      this.feeds.add(feed);

      expect(this.feeds.find(1)).toBe(null);
    });

    it("should return the feed when exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 1});
      this.feeds.add(feed);

      expect(this.feeds.find(1)).toBe(feed);
    });

  });

  describe("findMain", () => {
    it("should return null when not feed added", () => {
      expect(this.feeds.findMain()).toBe(null);
    });

    it("should return null when main feed doesn't exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 3});
      this.feeds.add(feed);

      expect(this.feeds.findMain()).toBe(null);
    });

    it("should return the main feed when exist", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({id: 1});
      this.feeds.add(feed, {main: true});

      expect(this.feeds.findMain()).toBe(feed);
    });
  });

  describe("allFeeds",  () => {
    it("should return and empty array when not feeds added", () => {
      expect(this.feeds.allFeeds().length).toBe(0);
    });

    it("should an array with all the feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isPublisher: true});
      this.feeds.add(feed1);
      this.feeds.add(feed2);
      this.feeds.add(feed3);

      expect(this.feeds.allFeeds().length).toBe(3);
    });

  });

  describe("publisherFeeds",  () => {
    it("should return an empty array when not feeds added", () => {
      expect(this.feeds.publisherFeeds().length).toBe(0);
    });

    it("should an empty array when not publisher feed added", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      this.feeds.add(feed1);
      this.feeds.add(feed2);

      expect(this.feeds.publisherFeeds().length).toBe(0);
    });


    it("should return an array with all publisher feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isPublisher: true});
      this.feeds.add(feed1);
      this.feeds.add(feed2);
      this.feeds.add(feed3);

      expect(this.feeds.publisherFeeds().length).toBe(1);
    });

  });

  describe("localScreenFeeds",  () => {
    it("should return an empty array when not feeds added", () => {
      expect(this.feeds.localScreenFeeds().length).toBe(0);
    });

    it("should an empty array when not localScreen feed added", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      this.feeds.add(feed1);
      this.feeds.add(feed2);

      expect(this.feeds.localScreenFeeds().length).toBe(0);
    });


    it("should return an array with all localScreen feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isLocalScreen: true});
      this.feeds.add(feed1);
      this.feeds.add(feed2);
      this.feeds.add(feed3);

      expect(this.feeds.localScreenFeeds().length).toBe(1);
    });

  });

  describe("speakingFeed",  () => {
    it("should return undefined when not feeds added", () => {
      expect(this.feeds.speakingFeed()).not.toBeDefined();
    });

    it("should call getSpeaking method in feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      this.feeds.add(feed1);
      spyOn(feed1, "getSpeaking");

      this.feeds.speakingFeed();

      expect(feed1.getSpeaking).toHaveBeenCalled();
    });



    it("should return undefined when not speaking feed", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      this.feeds.add(feed1);
      this.feeds.add(feed2);
      spyOn(feed1, "getSpeaking").and.returnValue(false);
      spyOn(feed2, "getSpeaking").and.returnValue(false);

      expect(this.feeds.speakingFeed()).not.toBeDefined();
    });


    it("should an array with all speaking feeds", () => {
      let feed1: Feed = new Feed();
      feed1.setAttrs({id: 1});
      let feed2: Feed = new Feed();
      feed2.setAttrs({id: 2});
      let feed3: Feed = new Feed();
      feed3.setAttrs({id: 3, isLocalScreen: true});
      this.feeds.add(feed1);
      this.feeds.add(feed2);
      this.feeds.add(feed3);
      spyOn(feed1, "getSpeaking").and.returnValue(false);
      spyOn(feed2, "getSpeaking").and.returnValue(false);
      spyOn(feed3, "getSpeaking").and.returnValue(true);

      expect(this.feeds.speakingFeed()).toBe(feed3);
    });

  });

  describe("waitFor",  () => {
    it("should call feeds.find with passed id", () => {
      spyOn(this.feeds, "find");

      this.feeds.waitFor(1);

      expect(this.feeds.find).toHaveBeenCalled();
    });

    it("should call feeds.find attemps + 1 times", <any>fakeAsync((): void => {
      spyOn(this.feeds, "find").and.returnValue(null);

      this.feeds.waitFor(1, 5, 10);

      tick(10);
      tick(10);
      tick(10);
      tick(10);
      (<any>this.feeds.find).and.callFake((): Feed => {
        let feed: Feed = new Feed();
        feed.setAttrs({id: 1});
        return feed;
      });
      tick(10);

      expect((<any>this.feeds.find).calls.count()).toBe(6);
    }));



  });

});
