/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Input, Inject } from "@angular/core";

import { Feed } from "../shared";

@Component({
  selector: "jh-ignore-button",
  template: require("./ignore-button.component.html")
})
export class IgnoreButtonComponent implements OnInit {

  @Input() public feed: Feed;

  constructor(@Inject('RoomService') private roomService: any) { }

  ngOnInit() { }

  public showsIgnore() {
    return (!this.feed.isPublisher && !this.feed.isIgnored);
  }

  public showsStopIgnoring() {
    return this.feed.isIgnored;
  }

  public ignore() {
    this.roomService.ignoreFeed(this.feed.id);
  }

  public stopIgnoring() {
    this.roomService.stopIgnoringFeed(this.feed.id);
  }
}
