/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component } from "@angular/core";

@Component({
  selector: "jh-footer",
  template: require("./footer.component.html"),
  styles: [require("!raw!sass!./footer.component.scss")]
})
export class FooterComponent {
  public version: string;

  constructor() {
    this.version = VERSION;
  }

}
