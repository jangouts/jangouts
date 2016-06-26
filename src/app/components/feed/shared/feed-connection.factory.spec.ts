import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { FeedConnection } from "./feed-connection.factory";

declare const jasmine;
declare const spyOn;

describe("Service: FeedConnection", () => {

  let pluginHandle: any;

  beforeEachProviders(() => {
    return [
      FeedConnection
    ];
  });

  beforeEach(() => {
    pluginHandle = {
      getPlugin: jasmine.createSpy("getPlugin"),
      getId: jasmine.createSpy("getId"),
      detach: jasmine.createSpy("detach"),
      send: jasmine.createSpy("send"),
      handleRemoteJsep: jasmine.createSpy("handleRemoteJsep"),
      data: jasmine.createSpy("data"),
      createOffer: jasmine.createSpy("createOffer"),
      createAnswer: jasmine.createSpy("createAnswer")
    };
  });

  it("should call console.log on create", () => {
    spyOn(window.console, "log");

    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    expect(window.console.log).toHaveBeenCalled();
  });

  it("should call pluginHandle.detach on call destroy", () => {
    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    fConnection.destroy();

    expect(pluginHandle.detach).toHaveBeenCalled();
  });

  it("should call pluginHandle.send on call register", () => {
    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    fConnection.register("display");

    expect(pluginHandle.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: {
          request: "join",
          room: 1,
          ptype: "publisher",
          display: "display"
        }
      })
    );
  });

  it("should call pluginHandle.send on call listen", () => {
    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    fConnection.listen(5);

    expect(pluginHandle.send).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: {
          request: "join",
          room: 1,
          ptype: "listener",
          feed: 5
        }
      })
    );
  });

  it("should call pluginHandle.handleRemoteJsep when call handleRemoteJsep", () => {
    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    let jsep: any = { id: 13 };
    fConnection.handleRemoteJsep(jsep);

    expect(pluginHandle.handleRemoteJsep).toHaveBeenCalledWith(
      jasmine.objectContaining({
        jsep: jsep
      })
    );
  });

  it("should call pluginHandle.data when call sendData", () => {
    let fConnection: FeedConnection = new FeedConnection();
    fConnection.setAttrs(
      pluginHandle,
      1
    );

    let data = { id: 1 };
    fConnection.sendData(data);

    expect(pluginHandle.data).toHaveBeenCalledWith(data);
  });

});
