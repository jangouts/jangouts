/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Input, Inject, forwardRef } from "@angular/core";

import { RoomService } from "../../room";
import { Feed } from "../shared";

@Component({
  selector: "jh-video-button",
  template: require("./video-button.component.html")
})
export class VideoButtonComponent implements OnInit {

  @Input() public feed: Feed;

  /* Needed in order to fix import barrels error https://github.com/angular/angular.io/issues/1301 */
  constructor(@Inject(forwardRef(() => RoomService)) private roomService: RoomService) { }

  public ngOnInit(): void { }

  public toggle(): void {
    this.roomService.toggleChannel("video", this.feed);
  }

  public showsEnable(): boolean {
    return (this.feed.isPublisher && !this.feed.getVideoEnabled());
  }

  public showsDisable(): boolean {
    return (this.feed.isPublisher && this.feed.getVideoEnabled());
  }

}
