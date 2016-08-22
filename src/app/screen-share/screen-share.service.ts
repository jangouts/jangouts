/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
export default ScreenShareService;

import { Injectable } from "@angular/core";

@Injectable()
export class ScreenShareService {

  private inProgress: boolean = false;

  constructor() {}

  public setInProgress(value: boolean): void {
    this.inProgress = value;
  }

  public getInProgress(): boolean {
    return this.inProgress;
  }
}

