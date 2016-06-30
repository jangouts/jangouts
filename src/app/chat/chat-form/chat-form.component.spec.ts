import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  inject,
  it
} from "@angular/core/testing";

import { Control } from "@angular/common";

declare const jasmine;
declare const spyOn;

import { ChatFormComponent } from "./chat-form.component";

class MockActionService {
  public writeChatMessage(text: string): void { }
}

describe("ChatForm", () => {
  beforeEachProviders(() => {
    this.actionService = new MockActionService();

    return [
      {provide: ChatFormComponent, useClass: ChatFormComponent},
      {provide: "ActionService", useValue: this.actionService}
    ];
  });

  beforeEach(inject([ ChatFormComponent ], (chatForm)  => {
    this.chatForm = chatForm;
    this.ctrlGroup = chatForm.chatForm.value;
    this.textField = <Control>this.chatForm.chatForm.controls["text"]
  }));

  it("should start with an empty text", () => {
    expect(this.ctrlGroup.text).toBe(null);
    expect(this.textField.value).toBe(null);
  });

  it("should reset text value on submit", () => {
    this.textField.updateValue("manual input");
    this.chatForm.submit();

    expect(this.ctrlGroup.text).toBe(null);
    expect(this.textField.value).toBe(null);
  });

  it("should use ActionService.writeChatMessage to send the message", () => {
    spyOn(this.actionService, "writeChatMessage");

    this.textField.updateValue("manual input");
    this.chatForm.submit();

    expect(this.actionService.writeChatMessage).toHaveBeenCalledWith("manual input");
  });
});
