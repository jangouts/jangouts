import {
  beforeEachProviders,
  inject,
  it
} from "@angular/core/testing";
import { Control } from "@angular/common";

import { ChatFormComponent } from "./chat-form.component";

// [TODO]: Move to action-service/action-service.mock.ts when ActionService mirated to Angular 2
import { provide, Provider } from "@angular/core";
class MockActionService {
  constructor() { }
  public writeChatMessage(text: string): void { }
  public getProvider(): Provider {
    return provide("ActionService", {useValue: this});
  }
}
// end TODO

describe("ChatForm", () => {
  let mockActionService: MockActionService;

  beforeEachProviders(() => {
    mockActionService = new MockActionService();
    return [
      ChatFormComponent,
      mockActionService.getProvider()
    ];
  });

  it("should have chatForm defined", inject([ ChatFormComponent ], (chatForm) => {
    expect(chatForm.chatForm).toBeDefined();
  }));

  it("should have control text defined", inject([ ChatFormComponent ], (chatForm) => {
    let field: string = "text";

    expect(chatForm.chatForm.controls[field]).toBeDefined();
  }));

  it("should have control text defined as null", inject([ ChatFormComponent ], (chatForm) => {
    expect(chatForm.chatForm.value.text).toBe(null);
  }));

  it("should reset text value on submit", inject([ ChatFormComponent ], (chatForm) => {
    let field: string = "text";

    (<Control>chatForm.chatForm.controls[field]).updateValue("manual input");
    chatForm.submit();

    expect(chatForm.chatForm.value.text).toBe(null);
  }));

  it("should call ActionService.writeChatMessage on submit", inject([ ChatFormComponent ], (chatForm) => {
    let field: string = "text";
    spyOn(mockActionService, "writeChatMessage");

    (<Control>chatForm.chatForm.controls[field]).updateValue("manual input");
    chatForm.submit();

    expect(mockActionService.writeChatMessage).toHaveBeenCalledWith("manual input");
  }));

});
