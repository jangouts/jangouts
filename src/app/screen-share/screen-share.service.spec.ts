import {
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";


import { ScreenShareService } from "./screen-share.service";

describe("Service: ScreenShareService", () => {

  beforeEach(() => {
    this.screenShareService = new ScreenShareService();
  });

  it("should return default value for inProgress", () => {
    expect(this.screenShareService.getInProgress()).toBe(false);
  });

  it("should return setted value for inProgress", () => {
    this.screenShareService.setInProgress(true);
    expect(this.screenShareService.getInProgress()).toBe(true);
  });

});
