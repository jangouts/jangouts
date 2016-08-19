import {
  addProviders,
  fakeAsync,
  flushMicrotasks,
  tick
} from "@angular/core/testing";

import { FeedsService } from "./feeds.service";
import { Feed } from "./feed.model";

declare const Promise: any;

describe("Service: FeedsService", () => {

  beforeEach(() => addProviders([
      {provide: FeedsService, useClass: FeedsService}
  ]));

  beforeEach(() => {
    this.feeds = new FeedsService();
  });


  describe("#find", () => {
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

  describe("#findMain", () => {
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

  describe("#allFeeds",  () => {
    it("should return an empty array when no feeds present", () => {
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

  describe("#publisherFeeds",  () => {
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

  describe("#localScreenFeeds",  () => {
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

  describe("#speakingFeed",  () => {
    it("should return undefined when not feeds added", () => {
      expect(this.feeds.speakingFeed()).not.toBeDefined();
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

  describe("#waitFor",  () => {
    beforeEach(() => {
      spyOn(this.feeds, "find").and.returnValue(null);
      this.feed = new Feed();
      this.feed.setAttrs({id: 1});
    });

    it("should return a promise that resolve with asked feed", <any>fakeAsync((): void => {
      let response: Promise<any> = this.feeds.waitFor(1, 3, 10);

      /*
       * Note: I don't know why but if I run `tick(20)` fails and run `tick(10)`
       * twice works. So for each interval cycle is necessary run one `tick`.
       */
      // 2 interval cycles (20ms in total)
      tick(10);
      tick(10);
      (<any>this.feeds.find).and.returnValue(this.feed);
      tick(10); // another interval cycle

      expect(this.feeds.find.calls.count()).toBe(4);

      flushMicrotasks(); // resolve promises

      response.then((feed) => {
        expect(feed).toBe(this.feed);
      });
    }));

    it("should return a promise rejected when feed not found", <any>fakeAsync((): void => {
      let rejectHandler: any = jasmine.createSpy("reject");
      this.feeds.waitFor(1, 3).catch(rejectHandler);

      // 3 interval cycles (with default timeout value)
      tick(1000);
      tick(1000);
      tick(1000);

      flushMicrotasks(); // resolve promises

      expect(rejectHandler).toHaveBeenCalled();
    }));

    it("should return a promise that resolve with the asked feed even if it means not to wait", <any>fakeAsync((): void => {
      this.feeds.find.and.returnValue(this.feed);
      let response: Promise<any> = this.feeds.waitFor(1);

      flushMicrotasks(); // resolve promises

      response.then((feed) => {
        expect(feed).toBe(this.feed);
      });

    }));
  });

  describe("#destroy", () => {
    it("should delete the feed from the feeds list", () => {
      this.feeds.add(this.feed);
      expect(this.feeds.find(1)).toBe(this.feed);

      this.feeds.destroy(1);
      expect(this.feeds.find(1)).toBe(null);
    });

    it("should delete the feed if it is main", () => {
      this.feeds.add(this.feed, {main: true});
      expect(this.feeds.findMain()).toBe(this.feed);

      this.feeds.destroy(1);
      expect(this.feeds.findMain()).toBe(null);
    });

  });
});
