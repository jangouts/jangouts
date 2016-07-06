import {
  beforeEachProviders,
  describe,
  expect,
  inject,
  it
} from "@angular/core/testing";

import { ChatComponent } from "./chat.component";

describe("Chat", () => {

  beforeEachProviders(() => [
    ChatComponent,
  ]);

  it("should work", inject([ ChatComponent ], (chat) => {

    chat.messages = [
      {
        text: function (): string { return "text input"; }
      }
    ];

  }));

});
