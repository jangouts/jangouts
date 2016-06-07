/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

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
  template: require("./jh-chat-message.html"),
  changeDetection: ChangeDetectionStrategy.OnPush
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
