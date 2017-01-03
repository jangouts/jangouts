import { inject, TestBed } from "@angular/core/testing";
import { ChatMessageComponent } from "./chat-message.component";

describe("Component: ChatMessage", () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: ChatMessageComponent, useClass: ChatMessageComponent},
    ]
  }));

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
