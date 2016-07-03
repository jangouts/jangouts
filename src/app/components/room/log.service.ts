/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from "@angular/core";

import { LogEntry } from "./logentry.model";

@Injectable()
export class LogService {

  public entries: Array<any> = [];

  constructor() { }

  public add(entry: LogEntry): any {
    this.entries.push(entry);
  }

  public allEntries(): any {
    return this.entries;
  }


}
