/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input } from "@angular/core";

import { Feed } from "./feeds.service";
import { VideoStream } from "./videostream.directive";

@Component({
  selector: "jh-main-feed",
   directives: [
    VideoStream
  ]
 templateUrl: "main-feed.component.html"
})
export class MainFeedComponent {

  @Input() public feed: Feed;
  @Input() public message: string;

  constructor() { }

}
