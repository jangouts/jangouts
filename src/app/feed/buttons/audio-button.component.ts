/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Input } from "@angular/core";

import { RoomService } from "../../room";
import { Feed } from "../shared";
import { Broadcaster } from "../../shared";

@Component({
  selector: "jh-audio-button",
  template: require("./audio-button.component.html")
})
export class AudioButtonComponent implements OnInit {

  @Input() public feed: Feed;

  constructor(private roomService: RoomService,
              private broadcaster: Broadcaster) { }

  public ngOnInit(): void { }

  public toggle(): void {
    this.roomService.toggleChannel("audio", this.feed);
    if (this.feed.isPublisher && !this.feed.isLocalScreen && !this.feed.getAudioEnabled()) {
      this.broadcaster.broadcast("dismissLastNotification");
    }
  }

  public showsEnable(): boolean {
    return (this.feed.isPublisher && !this.feed.isLocalScreen && !this.feed.getAudioEnabled());
  }

  public showsDisable(): boolean {
    return (!this.feed.isIgnored && this.feed.getAudioEnabled());
  }

  public showsAudioOff(): boolean {
    return !(this.feed.isPublisher || this.feed.isIgnored || this.feed.getAudioEnabled());
  }

}
