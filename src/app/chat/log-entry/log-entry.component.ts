/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input } from "@angular/core"

@Component({
  selector: "jh-log-entry",
  template: require("./log-entry.component.html")
})
export class LogEntryComponent {

  @Input() message: any;

  public text: string;

  constructor () { }

  ngOnInit(): void {
    this.text = this.message.text();
  }
}
