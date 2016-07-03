/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Directive, ElementRef, Input } from "@angular/core";

@Directive({ selector: "[jhVideoStream]" })
export class VideoStreamDirective {

  @Input() public mutted: boolean = false;

  constructor (private el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input("jhVideoStream")
  set stream(stream: any) {
    if (stream !== undefined && stream !== null) {
      let video: HTMLVideoElement = <HTMLVideoElement>this.el.nativeElement;
      video.muted = this.mutted; // mute video of the local stream
      attachMediaStream(video, stream);
    }
  }
}
