import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { ConnectionConfig, IWanted } from "./connection-config.model";

declare const jasmine;
declare const spyOn;

describe("Service: ConnectionConfig", () => {

  beforeEachProviders(() => {
    return [
      {provide: ConnectionConfig, useClass: ConnectionConfig}
    ];
  });

  beforeEach(() => {
    this.config = {
      audio: true,
      video: true,
    };

    this.pluginHandle = {
      send: jasmine.createSpy("pluginHandle.send")
    };
  });

  it("should call pluginHandle.send on create", () => {
    let cconfig = new ConnectionConfig(
      this.pluginHandle,
      this.config,
      {},
      undefined
    );

    expect(cconfig).toBeDefined();
    expect(this.pluginHandle.send).toHaveBeenCalled();
  });

  describe("#get", () => {

    it("should return undefined until confirm", () => {
      let cconfig: ConnectionConfig = new ConnectionConfig(
        this.pluginHandle,
        this.config,
        {},
        undefined
      );

      expect(cconfig.get()).not.toBeDefined();

      cconfig.confirm();

      expect(cconfig.get()).toEqual(this.config);
    });

    it("should show an error when pluginHandle raise an error", () => {
      this.pluginHandle.send.and.callFake((options: any) => {
        options.error();
      });

      let cconfig: ConnectionConfig = new ConnectionConfig(
        this.pluginHandle,
        this.config,
        {},
        undefined
      );
      spyOn(window.console, "error");

      expect(cconfig.get()).not.toBeDefined();

      cconfig.confirm();

      expect(window.console.error).toHaveBeenCalled();
    });

    it("should call ok callback when confirm", () => {
      this.pluginHandle.send.and.callFake((options: any) => {
        options.success();
      });

      let ok: any = jasmine.createSpy("ok");

      let cconfig: ConnectionConfig = new ConnectionConfig(
        this.pluginHandle,
        this.config,
        {},
        ok
      );

      expect(cconfig.get()).not.toBeDefined();

      cconfig.confirm();

      expect(ok).toHaveBeenCalled();
    });
  });

  describe("#set", () => {
    it("should set new options", () => {
      this.pluginHandle.send.and.callFake((options: any) => {
        options.success();
      });

      let ok: any = jasmine.createSpy("ok");
      let newOk: any = jasmine.createSpy("newOk");

      let cconfig: ConnectionConfig = new ConnectionConfig(
        this.pluginHandle,
        this.config,
        {},
        ok
      );

      expect(cconfig.get()).not.toBeDefined();

      cconfig.set({
        values: {
          audio: true,
          video: false
        },
        ok: ok
      });
      cconfig.confirm();
      expect(ok).toHaveBeenCalled();

      cconfig.set({ ok: newOk});
      cconfig.confirm();
      expect(newOk).not.toHaveBeenCalled();
    });
  });

});
