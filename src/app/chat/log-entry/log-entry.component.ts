/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "jh-log-entry",
  template: require("./log-entry.component.html")
})
export class LogEntryComponent implements OnInit {

  @Input() public message: any;

  public text: string;

  constructor () { }

  public ngOnInit(): void {
    this.text = this.message.text();
  }
}
