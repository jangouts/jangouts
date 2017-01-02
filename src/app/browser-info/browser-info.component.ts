/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { Modal } from "angular2-modal/plugins/bootstrap";
import { ConfigService } from "../config.provider";

@Component({
  selector: "jh-browser-info",
  template: require("./browser-info.component.html")
})
export class BrowserInfoComponent implements OnInit {

  public modalBody: string = require("./browser-info.modal.html");

  constructor(public modal: Modal,
              private config: ConfigService,
              private sanitizer: DomSanitizer,
              vcRef: ViewContainerRef) {
      modal.overlay.defaultViewContainer = vcRef;
  }

  public ngOnInit(): void { }

  public sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public showHelp(): void {

    // [TODO] - compile modalBody manualy
    /*
    let usingSSL: boolean = this.config.usingSSL;
    let httpsUrl: SafeUrl = this.sanitize(this.config.httpsUrl);
    let aboutConfig: SafeUrl = this.sanitize("about:config");
    */

    this.modal.alert()
      .size("lg")
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title("Information about browsers")
      .body(this.modalBody)
      .open();
  }
}
