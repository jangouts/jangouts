/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";

import { ConfigService } from "../config.provider";

@Component({
  selector: "jh-thumbnails-mode-button",
  template: require("./thumbnails-mode-button.component.html")
})
export class ThumbnailsModeButtonComponent implements OnInit {

  constructor(private config: ConfigService) { }

  public ngOnInit(): void { }

  public click(ev: any): void {
    this.config.videoThumbnails = !this.config.videoThumbnails;
  }

  public isChecked(): boolean {
    return this.config.videoThumbnails;
  }
}
