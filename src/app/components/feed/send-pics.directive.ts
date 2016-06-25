/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Directive, ElementRef, Input } from "@angular/core";

import { Feed } from "./feeds.factory";

@Directive({ selector: "[jhSendPics]" })
export class SendPics {

  @Input("jhSendPics") public feed: Feed;

  private el: any;
  private picCanvas: any;
  private picSource: any;
  private picContext: any;

  constructor (el: ElementRef) {
    this.el = el.nativeElement;

    /* For publisher feeds, we have to constantly send video and photos */
    if (this.feed.isPublisher) {
      this.initPics(this.el);
      this.takePic();
      setInterval(this.takePic, 20000)
    }
  }

  public initPics(element): void {
    let canvas = $('canvas', element)
    let canvasTag = <HTMLCanvasElement>canvas[0];
    let video = $('video', element).first();
    let context = canvasTag.getContext('2d');

    // initially set it to 4:3 (fitting the placeholder image)
    canvasTag.width = canvas.width();
    canvasTag.height = Math.round(canvasTag.width * 0.75);

    let placeholder = new window.Image();
    placeholder.src = require("../../../assets/images/placeholder.png");
    placeholder.onload = function() {
      context.drawImage(placeholder, 0, 0, canvasTag.width, canvasTag.height);
    };

    this.picCanvas = canvas;
    this.picSource = video;
    this.picContext = context;
  }

  public takePic(): void {
    let canvas = this.picCanvas[0];
    let width = canvas.width;
    // skip the rest if the video has no dimensions yet
    if (this.picSource[0].videoHeight) {
      let height = width * this.picSource[0].videoHeight / this.picSource[0].videoWidth;
      canvas.height = height;
      this.picContext.drawImage(this.picSource[0], 0, 0, width, height);
      this.feed.updateLocalPic(canvas.toDataURL('image/jpeg', 0.4));
    }
  }

}
