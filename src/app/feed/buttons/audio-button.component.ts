/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Input, Inject } from "@angular/core";

import { Feed } from "../shared";

@Component({
  selector: "jh-audio-button",
  template: require("./audio-button.component.html")
})
export class AudioButtonComponent implements OnInit {

  @Input() public feed: Feed;

  constructor(@Inject("RoomService") private roomService: any,
              @Inject("MuteNotifier") private muteNotifier: any) { }

  public ngOnInit(): void { }

  public toggle(): void {
    this.roomService.toggleChannel("audio", this.feed);
    if (this.feed.isPublisher && !this.feed.isLocalScreen && !this.feed.getAudioEnabled()) {
      this.muteNotifier.dismissLastNotification();
    }
  }

  public showsEnable(): boolean {
    return (this.feed.isPublisher && !this.feed.isLocalScreen && !this.feed.getAudioEnabled());
  }

  public showsDisable(): boolean {
    return (!this.feed.isIgnored && this.feed.getAudioEnabled());
  }

  public showsAudioOff() {
    return !(this.feed.isPublisher || this.feed.isIgnored || this.feed.getAudioEnabled());
  }

}
