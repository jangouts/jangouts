import {
  beforeEachProviders,
  beforeEach,
  describe,
  inject,
  expect,
  it
} from "@angular/core/testing";

import { ChatMessageComponent } from "./chat-message.component";

declare const jasmine;

describe("Component: ChatMessage", () => {

  beforeEachProviders(() => [
    {provide: ChatMessageComponent, useClass: ChatMessageComponent},
  ]);

  beforeEach(inject([ ChatMessageComponent ], (chatMessage) => {
    this.chatMessage = chatMessage;
  }));

  it("should have embedOptions defined", () => {
    expect(this.chatMessage.embedOptions).toEqual(jasmine.objectContaining({
      link: true,
      linkTarget: "_blank",
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
    }));
  });

});
