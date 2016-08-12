/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "jh-browser-info",
  template: require("./browser-info.component.html")
})
export class BrowserInfoComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void { }

  public showHelp(): void {
    console.warn("Not implemented yet");
    /* MIGRATED VERSION */
    /*
     this.modal.alert()
      .size('lg')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Information about browsers')
      .body(require("./browser-info.modal.html")
      .open();
     */

    /*
    $modal.open({
        animation: true,
        template: require('./browser-info.html'),
        controller: 'BrowserInfoCtrl',
        controllerAs: 'vm'
      });
    */
  }
}
