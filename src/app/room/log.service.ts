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

  public entries: Array<LogEntry> = [];

  constructor() { }

  public add(entry: LogEntry): void {
    this.entries.push(entry);
  }

  public allEntries(): Array<LogEntry> {
    return this.entries;
  }


}
