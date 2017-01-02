/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input } from "@angular/core";

import { Feed, VideoStreamDirective } from "../shared";

@Component({
  selector: "jh-main-feed",
  template: require("./main-feed.component.html"),
  styles: [require("!raw!sass!./main-feed.component.scss")]
})
export class MainFeedComponent {

  @Input() public feed: Feed;
  @Input() public message: string;

  constructor() { }

}
