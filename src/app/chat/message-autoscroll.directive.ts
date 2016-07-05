/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Directive, ElementRef, Input } from "@angular/core";

@Directive({ selector: "[jhAutoScroll]" })
export class AutoScrollDirective {

  private el: any;

  constructor (el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input("jhAutoScroll")
  set autoScroll(itemsList: Array<any>) {
    setTimeout((newValue) => {
      this.el.scrollTop = this.el.scrollHeight;
    } , 100);
  }
}
