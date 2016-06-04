/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'jh-footer',
  template: require('./jh-footer.html')
})
export class FooterComponent {
  version: string;

  constructor() {
    this.version = VERSION;
  }

}
