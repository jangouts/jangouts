/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component } from "@angular/core";

import { ActionService } from "../../room";


@Component({
  selector: "jh-chat-form",
  template: require("./chat-form.component.html")
})
export class ChatFormComponent {

  public text: string = null;

  constructor(private actionService: ActionService) {}

  public submit(): void {
    this.actionService.writeChatMessage(this.text);
    this.text = null;
  }

}
