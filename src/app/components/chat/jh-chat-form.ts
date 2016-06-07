/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import {
  Component,
  Inject,
  ChangeDetectionStrategy
} from "@angular/core";

import {
  Control,
  ControlGroup,
  Validators,
  FORM_DIRECTIVES
} from '@angular/common';

//import ActionService from '../room/action.service';


//import ActionService from '../room/action.service';

@Component({
  selector: "jh-chat-form",
  template: require("./jh-chat-form.html"),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [FORM_DIRECTIVES]
})
export class ChatFormComponent {

  chatForm: ControlGroup;
  actionService: any;

  constructor(@Inject('ActionService') actionService: any) {
    this.actionService = actionService;
    this.chatForm = new ControlGroup({
      text: new Control(null, Validators.required)
    });
  }

  public submit(): void {
    this.actionService.writeChatMessage(this.chatForm.value.text);
    (<Control>this.chatForm.controls['text']).updateValue(null);
  }

}
