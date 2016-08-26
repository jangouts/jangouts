import { inject, addProviders } from "@angular/core/testing";

import { ChatFormComponent } from "./chat-form.component";
import { ActionService } from "../../room";

class MockActionService {
  public writeChatMessage(text: string): void { }
}

describe("Component: ChatForm", () => {
  beforeEach(() => {
    this.actionService = new MockActionService();

    addProviders([
      {provide: ChatFormComponent, useClass: ChatFormComponent},
      {provide: ActionService, useValue: this.actionService}
    ]);
  });

  beforeEach(inject([ ChatFormComponent ], (chatForm)  => {
    this.chatForm = chatForm;
  }));

  it("should start with an empty text", () => {
    expect(this.chatForm.text).toBe(null);
  });

  it("should reset text value on submit", () => {
    this.chatForm.text = "manual input";
    this.chatForm.submit();

    expect(this.chatForm.text).toBe(null);
  });

  it("should use ActionService.writeChatMessage to send the message", () => {
    spyOn(this.actionService, "writeChatMessage");

    this.chatForm.text = "manual input";
    this.chatForm.submit();

    expect(this.actionService.writeChatMessage).toHaveBeenCalledWith("manual input");
  });
});
