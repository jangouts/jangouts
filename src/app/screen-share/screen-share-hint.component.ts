/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, ViewContainerRef } from "@angular/core";
import {Modal, BS_MODAL_PROVIDERS} from 'angular2-modal/plugins/bootstrap';

import { ConfigService } from "../config.provider";
import { ScreenShareService } from "./screen-share.service";

@Component({
  selector: "jh-screen-share-hint",
  template: require("./screen-share-hint.component.html"),
  viewProviders: [ ...BS_MODAL_PROVIDERS ]
})
export class ScreenShareHintComponent implements OnInit {

  constructor(public modal: Modal,
              private config: ConfigService,
              viewContainer: ViewContainerRef) {
      modal.defaultViewContainer = viewContainer;
  }

  public ngOnInit(): void { }

  public visible(): boolean {
    return (this.usingSSL() || this.httpsUrl() !==  null);
  }

  public usingSSL(): boolean {
    return this.config.usingSSL;
  }

  public showHelp(): void {
    this.modal.alert()
      .size('lg')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title("Screen sharing")
      .body(require("./screen-share-help.modal.html"))
      .open();
  }

  public httpsUrl(): string {
    return this.config.httpsUrl;
  }
}


