/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../config.provider";
import { ScreenShareService } from "./screen-share.service";

@Component({
  selector: "jh-screen-share-hint",
  template: require("./screen-share-hint.component.html"),
})
export class ScreenShareHintComponent implements OnInit {

  constructor(private screenShareService: ScreenShareService,
              private config: ConfigService) {}

  public ngOnInit(): void { }

  public visible(): boolean {
    return (this.usingSSL() || this.httpsUrl() !==  null);
  }

  public usingSSL(): boolean {
    return this.config.usingSSL;
  }

  public showHelp(): void {
    /*
    this.modal.alert()
      .size('lg')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title("Screen sharing")
      .body(require("./screen-share-help.modal.html")
      .open();
    */
  }

  public httpsUrl(): string {
    return this.config.httpsUrl;
  }
}


