/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

import { Broadcaster } from "../shared";
import { Feed } from "./shared/feed.model";
import { VideoStreamDirective } from "./shared/videostream.directive";
import { SendPicsDirective } from "./send-pics.directive";
import { SetVideoSubscriptionDirective } from "./set-video-subscription.directive";

import {
  AudioButtonComponent,
  VideoButtonComponent,
  IgnoreButtonComponent,
  UnpublishButtonComponent
} from "./buttons";


@Component({
  selector: "jh-feed",
  template: require("./feed.component.html"),
  styles: [require("!raw!sass!./feed.component.scss")],
  directives: [
    SendPicsDirective,
    VideoStreamDirective,
    SetVideoSubscriptionDirective,
    AudioButtonComponent,
    VideoButtonComponent,
    IgnoreButtonComponent,
    UnpublishButtonComponent
  ]
})
export class FeedComponent implements OnInit {

  @Input() public feed: Feed;
  @Output() public toggleHighlight: EventEmitter<Feed> = new EventEmitter<Feed>();
  @Input() public highlighted: boolean;
  @Input() public highlightedByUser: boolean;

  private mirrored: boolean = false;

  constructor(private broadcaster: Broadcaster) { }

  public ngOnInit(): void {
    this.mirrored = (this.feed.isPublisher && !this.feed.isLocalScreen);
  }

  @Input()
  set isVoiceDetected(val: boolean) {
    /*
     * Broadcast only if muted (check for false, undefined means still connecting)
     */
    if (this.feed.isPublisher && !this.feed.isLocalScreen && val && !this.feed.getAudioEnabled()) {
      this.broadcaster.broadcast("speaking");
    }
  }

  public thumbnailTag(): string {
    if (this.highlighted || this.feed.isIgnored) { return "placeholder"; }
    if (!this.feed.getVideoEnabled()) { return "placeholder"; }
    if (this.feed.isPublisher) { return "video"; }

    if (this.feed.getVideoSubscription()) {
      return "video";
    } else {
      if (this.feed.getPicture()) {
        return "picture";
      } else {
        return "placeholder";
      }
    }
  }

  public click (): void {
    this.toggleHighlight.emit(this.feed);
  }

}
