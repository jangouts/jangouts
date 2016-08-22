import {
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { Broadcaster } from "./broadcaster.service";

declare const jasmine: any;
declare const spyOn: any;

describe("Service: Broadcaster", () => {

  beforeEach(() => {
    this.broadcaster = new Broadcaster();
  });

  it("should be notified on event raise", () => {
    let eventHandler: any = jasmine.createSpy("eventHandler");
    this.broadcaster.on("MyEvent").subscribe(eventHandler);

    this.broadcaster.broadcast("MyEvent", "example message");

    expect(eventHandler).toHaveBeenCalledWith("example message");
  });

  it("should not be notified if not subscribed to the event", () => {
    let eventHandler: any = jasmine.createSpy("eventHandler");
    this.broadcaster.on("MyEvent").subscribe(eventHandler);

    this.broadcaster.broadcast("AnotherEvent", "example message");

    expect(eventHandler).not.toHaveBeenCalled();

  });

});
