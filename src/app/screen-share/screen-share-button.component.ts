/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";

import { RoomService } from "../room";
import { ConfigService } from "../config.provider";
import { ScreenShareService } from "./screen-share.service";

@Component({
  selector: "jh-screen-share-button",
  template: require("./screen-share-button.component.html")
})
export class ScreenShareButtonComponent implements OnInit {

  constructor(private screenShareService: ScreenShareService,
              private roomService: RoomService,
              private config: ConfigService) {}

  public ngOnInit(): void { }

  public click(): void {
    if (this.enabled()) {
      this.roomService.publishScreen();
    }
  }

  public enabled(): boolean {
    return (this.config.usingSSL && !this.screenShareService.getInProgress());
  }

  public title(): string {
    if (this.enabled()) {
      return "Share a window/desktop";
    } else {
      if (this.screenShareService.getInProgress()) {
        return "Wait while the screen is shared";
      } else {
        return "Screen sharing disabled (no SSL?)";
      }
    }
  }

}

