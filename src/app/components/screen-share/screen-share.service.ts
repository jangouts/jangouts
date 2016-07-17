/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
export default ScreenShareService;

import { Injectable, Inject } from "@angular/core";

@Injectable()
export class ScreenShareService {

  private inProgress: boolean = false;

  // [TODO] - Reenable when $modal upgraded
  // constructor(@Inject("$modal") private $modal: any) {}
  constructor() {}

  public setInProgress(value: boolean): void {
    this.inProgress = value;
  }

  public getInProgress(): boolean {
    return this.inProgress;
  }

  // public showHelp(): void {
    // this.$modal.open({
      // animation: true,
      // template: require("./screen-share-help.html"),
      // controller: "ScreenShareHelpCtrl",
      // controllerAs: "vm"
    // });
  // }
}

