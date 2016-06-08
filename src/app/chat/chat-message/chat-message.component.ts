/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input } from "@angular/core";

//TODO: Reenable ngEmbed when angular adapter supports templateUrl functions
//import { upgradeAdapter } from '../../adapter';

// Upgrade ngEmbed directive
//const NgEmbed = upgradeAdapter.upgradeNg1Component('ngEmbed');


// Define interface for embedOptions
interface IEmbedOptions {
  link: boolean;
  linkTarget: string;
  image: {
    embed: boolean;
  };
  pdf: {
    embed: boolean;
  };
  audio: {
    embed: boolean;
  };
  code: {
    highlight: boolean;
  };
  basicVideo: boolean;
  tweetEmbed: boolean;
}

@Component({
  selector: "jh-chat-message",
  template: require("./chat-message.component.html"),
  styles: [require("!raw!sass!./chat-message.component.scss")]
})
export class ChatMessageComponent {

  @Input() message: any;

  public embedOptions: IEmbedOptions = {
      link: true,
      linkTarget: '_blank',
      image: {
        embed: true
      },
      pdf: {
        embed: false
      },
      audio: {
        embed: true
      },
      code: {
        highlight: false,
      },
      basicVideo: true,
      tweetEmbed: false
  };

  constructor() { }

}
