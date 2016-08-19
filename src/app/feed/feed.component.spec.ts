import {
  inject, addProviders
} from '@angular/core/testing';

import { FeedComponent } from "./feed.component";
import { Broadcaster } from "../shared";

describe("Component: Feed", () => {
  beforeEach(() => addProviders([
      {provide: FeedComponent, useClass: FeedComponent},
      {provide: Broadcaster, useClass: Broadcaster},
  ]));

  beforeEach(inject([ FeedComponent ], (feedComponent)  => {
    this.feedComponent = feedComponent;
    this.feedComponent.feed = {
      isPublisher: false,
      isLocalScreen: false,
      isIgnored: false,
      getVideoEnabled: jasmine.createSpy("feed.getVideoEnabled").and.returnValue(true),
      getVideoSubscription: jasmine.createSpy("feed.getVideoSubscription").and.returnValue(false),
      getPicture: jasmine.createSpy("feed.getPicture").and.returnValue(false)
    };
    this.feedComponent.highlighted = false;
    this.feedComponent.highlightedByUser = false;

    this.feedComponent.ngOnInit();
  }));

  describe("#thumbnailTag", () => {

    it("should return placeholder if highlighted", () => {
      this.feedComponent.highlighted = true;
      expect(this.feedComponent.thumbnailTag()).toEqual("placeholder");
    });

    it("should return placeholder if feed is ignored", () => {
      this.feedComponent.highlighted = true;
      this.feedComponent.feed.isIgnored = true;
      expect(this.feedComponent.thumbnailTag()).toEqual("placeholder");
    });

    it("should return placeholder if feed has not video enabled", () => {
      this.feedComponent.feed.getVideoEnabled.and.returnValue(false);
      expect(this.feedComponent.thumbnailTag()).toEqual("placeholder");
    });

    it("should return video if feed isPublisher", () => {
      this.feedComponent.feed.isPublisher = true;
      expect(this.feedComponent.thumbnailTag()).toEqual("video");
    });

    it("should return video if feed has video subscription", () => {
      this.feedComponent.feed.getVideoSubscription.and.returnValue(true);
      expect(this.feedComponent.thumbnailTag()).toEqual("video");
    });

    it("should return picture if feed has not video subscription but has picture", () => {
      this.feedComponent.feed.getPicture.and.returnValue(true);
      expect(this.feedComponent.thumbnailTag()).toEqual("picture");
    });

    it("should return placeholder if feed not has video subscription or picture", () => {
      expect(this.feedComponent.thumbnailTag()).toEqual("placeholder");
    });

  });

});


