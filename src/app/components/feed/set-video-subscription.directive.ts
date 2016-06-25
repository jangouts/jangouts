/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Directive, ElementRef, Input } from "@angular/core";

import { Feed } from "./feeds.factory";

@Directive({ selector: "[jhSetVideoSubscription]" })
export class SetVideoSubscription {

  @Input() public feed: Feed;
  @Input() public initial: boolean;

  private el: any;

  constructor (el: ElementRef) {
    this.el = el.nativeElement;

    this.feed.setVideoSubscription(this.initial);
  }

  @Input("jhSetVideoSubscription")
  set setVideoSubscription(video: boolean) {
    /* For subscribers we have to manage the video subscription */
    if(!feed.isPublisher) {
      this.feed.setVideoSubscription(video);
    }
  }

}
