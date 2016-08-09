/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component } from "@angular/core";

import {
  Control,
  ControlGroup,
  Validators,
  FORM_DIRECTIVES
} from "@angular/common";

import { ActionService } from "../../room";


@Component({
  selector: "jh-chat-form",
  template: require("./chat-form.component.html"),
  directives: [FORM_DIRECTIVES]
})
export class ChatFormComponent {

  public chatForm: ControlGroup;

  constructor(private actionService: ActionService) {
    this.chatForm = new ControlGroup({
      text: new Control(null, Validators.required)
    });
  }

  public submit(): void {
    let field: string = "text";

    this.actionService.writeChatMessage(this.chatForm.value.text);
    (<Control>this.chatForm.controls[field]).updateValue(null);
  }

}
