/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input, OnInit } from "@angular/core";

import { ChatMessageComponent} from "./chat-message";
import { ChatFormComponent} from "./chat-form";
import { LogEntryComponent} from "./log-entry";
import { AutoScrollDirective } from "./message-autoscroll.directive";

@Component({
  selector: "jh-chat",
  template: require("./chat.component.html"),
  styles: [require("!raw!sass!./chat.component.scss")],
  directives: [
    ChatFormComponent,
    ChatMessageComponent,
    LogEntryComponent,
    AutoScrollDirective
  ]
})
export class ChatComponent implements OnInit {

  @Input() public messages: any;

  constructor () { }

  public ngOnInit(): void { }

}
