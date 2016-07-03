/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Input, Inject } from "@angular/core";

import { Feed } from "../shared";

@Component({
  selector: "jh-unpublish-button",
  template: require("./unpublish-button.component.html")
})
export class UnpublishButtonComponent implements OnInit {

  @Input() public feed: Feed;

  constructor(@Inject("RoomService") private roomService: any) { }

  public ngOnInit(): void { }

  public click(): void {
    this.roomService.unPublishFeed(this.feed.id);
  }

  public isVisible(): boolean  {
    return (this.feed.isPublisher && this.feed.isLocalScreen);
  }

}
