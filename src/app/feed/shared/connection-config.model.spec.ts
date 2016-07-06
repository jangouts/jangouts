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
    this.pluginHandle = {
      send: jasmine.createSpy(": voidpluginHandle.send")
    };
  });

  it("should call pluginHandle.send on create", () => {
    let config: IWanted = {
      audio: true,
      video: true,
    };
    let cconfig = new ConnectionConfig(
      this.pluginHandle,
      config,
      {},
      undefined
    );

    expect(cconfig).toBeDefined();
    expect(this.pluginHandle.send).toHaveBeenCalled();
  });

  it("should not be defined until confirm", () => {
    let config: IWanted = {
      audio: true,
      video: true,
    };
    let cconfig: ConnectionConfig = new ConnectionConfig(
      this.pluginHandle,
      config,
      {},
      undefined
    );

    expect(cconfig.get()).not.toBeDefined();

    cconfig.confirm();

    expect(cconfig.get()).toEqual(config);
  });

  it("should call console.error after pluginHandle.send calls error", () => {
    let config: IWanted = {
      audio: true,
      video: true,
    };

    this.pluginHandle.send = jasmine.createSpy("pluginHandle.send").and.callFake((options: any) => {
      options.error();
    });

    let cconfig: ConnectionConfig = new ConnectionConfig(
      this.pluginHandle,
      config,
      {},
      undefined
    );
    spyOn(window.console, "error");

    expect(cconfig.get()).not.toBeDefined();

    cconfig.confirm();

    expect(window.console.error).toHaveBeenCalled();
  });

  it("should call ok callback when confirm", () => {
    let config: IWanted = {
      audio: true,
      video: true,
    };

    this.pluginHandle.send = jasmine.createSpy("pluginHandle.send").and.callFake((options: any) => {
      options.success();
    });

    let ok: any = jasmine.createSpy("ok");

    let cconfig: ConnectionConfig = new ConnectionConfig(
      this.pluginHandle,
      config,
      {},
      ok
    );

    expect(cconfig.get()).not.toBeDefined();

    cconfig.confirm();

    expect(ok).toHaveBeenCalled();
  });

  it("should not call new ok callback when pluginHandle success for all calls", () => {
    let config: IWanted = {
      audio: true,
      video: true,
    };

    this.pluginHandle.send = jasmine.createSpy("pluginHandle.send").and.callFake((options: any) => {
      options.success();
    });

    let ok: any = jasmine.createSpy("ok");
    let newOk: any = jasmine.createSpy("newOk");

    let cconfig: ConnectionConfig = new ConnectionConfig(
      this.pluginHandle,
      config,
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
