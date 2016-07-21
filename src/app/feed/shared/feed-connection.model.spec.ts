import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { FeedConnection } from "./feed-connection.model";

declare const jasmine;
declare const spyOn;

describe("Service: FeedConnection", () => {

  beforeEachProviders(() => {
    return [
      {provide: FeedConnection, useClass: FeedConnection}
    ];
  });

  beforeEach(() => {
    this.pluginHandle = {
      getPlugin: jasmine.createSpy("getPlugin"),
      getId: jasmine.createSpy("getId"),
      detach: jasmine.createSpy("detach"),
      send: jasmine.createSpy("send"),
      handleRemoteJsep: jasmine.createSpy("handleRemoteJsep"),
      data: jasmine.createSpy("data"),
      createOffer: jasmine.createSpy("createOffer"),
      createAnswer: jasmine.createSpy("createAnswer")
    };
    this.connection = new FeedConnection();
    this.connection.setAttrs(
      this.pluginHandle,
      1
    );
  });

  describe("#destroy", () => {
    it("should detach pluginHandle", () => {
      this.connection.destroy();
      expect(this.pluginHandle.detach).toHaveBeenCalled();
    });
  });

  describe("#register", () => {
    it("should send join request as publisher", () => {
      this.connection.register("display");

      expect(this.pluginHandle.send).toHaveBeenCalledWith(
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
  });

  describe("#listen", () => {
    it("should send join request as listener", () => {
      this.connection.listen(5);

      expect(this.pluginHandle.send).toHaveBeenCalledWith(
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
  });

  describe("#handleRemoteJsep", () => {
    it("should call pluginHandle.handleRemoteJsep", () => {
      let jsep: any = { id: 13 };
      this.connection.handleRemoteJsep(jsep);

      expect(this.pluginHandle.handleRemoteJsep).toHaveBeenCalledWith(
        jasmine.objectContaining({
          jsep: jsep
        })
      );
    });
  });

  describe("#sendData", () => {
    it("should call pluginHandle.data", () => {
      let data = { id: 1 };
      this.connection.sendData(data);

      expect(this.pluginHandle.data).toHaveBeenCalledWith(data);
    });
  });

  describe("#publish", () => {
    beforeEach(() => {
      this.options = jasmine.createSpyObj("options", ["success", "error"]);
    });

    it("should create a webRTC offer as subscriber", () => {
      this.connection.publish();

      expect(this.pluginHandle.createOffer).toHaveBeenCalledWith(
        jasmine.objectContaining({
          media: {
            videoRecv: false,
            audioRecv: false,
            video: "screen",
            audioSend: false,
            data: false
          },
          success: jasmine.any(Function),
          error: jasmine.any(Function)
        })
      );
    });

    it("should create a webRTC offer as main", () => {
      this.connection.role = "main";
      this.connection.publish();

      expect(this.pluginHandle.createOffer).toHaveBeenCalledWith(
        jasmine.objectContaining({
          media: {
            videoRecv: false,
            audioRecv: false,
            audioSend: true,
            videoSend: true,
            data: true
          },
          success: jasmine.any(Function),
          error: jasmine.any(Function)
        })
      );
    });

    it("should call success callback when webRTC offer succeeds", () => {
      this.pluginHandle.createOffer.and.callFake((options) => {
        options.success()
      });
      this.connection.publish(this.options);

      expect(this.options.success).toHaveBeenCalled();
    });

    it("should call success callback when webRTC offer succeeds", () => {
      this.pluginHandle.createOffer.and.callFake((options) => {
        options.error()
      });
      this.connection.publish(this.options);

      expect(this.options.error).toHaveBeenCalled();
    });

  });

  describe("#subscribe", () => {
    beforeEach(() => {
      this.jsepVal = {};
    });
    it("should create a webRTC answer", () => {
      this.connection.subscribe(this.jsepVal);

      expect(this.pluginHandle.createAnswer).toHaveBeenCalledWith(
        jasmine.objectContaining({
          jsep: this.jsepVal,
          media: {
            audioSend: false,
            videoSend: false,
            data: true
          },
          success: jasmine.any(Function),
          error: jasmine.any(Function)
        })
      );
    });

    it("should send a request start message when webRTC answer succeeds", () => {
      this.pluginHandle.createAnswer.and.callFake((options) => {
        options.success(this.jsepVal);
      });
      this.connection.subscribe(this.jsepVal);

      expect(this.pluginHandle.send).toHaveBeenCalledWith(
        jasmine.objectContaining({
          message: {
            request: "start",
            room: 1
          },
          jsep: this.jsepVal
        })
      );
    });

    it("should shows an error when webRTC answer fails", () => {
      this.pluginHandle.createAnswer.and.callFake((options) => {
        options.error();
      });
      spyOn(window.console, "error");
      this.connection.subscribe(this.jsepVal);

      expect(window.console.error).toHaveBeenCalled();
    });
  });

  describe("#setConfig", () => {
    beforeEach(() => {
      this.options = {
        values: {
          audio: true,
          video: true
        },
        ok: jasmine.createSpy("okCallback")
      };
    });

    it("should create a new config if it doesn't exist", () => {
      expect(this.connection.config).toBe(null);
      this.connection.setConfig(this.options);

      expect(this.connection.config).not.toBe(null);
    });

    it("should update the existing config", () => {
      this.connection.config = jasmine.createSpyObj("config", ["set"]);
      this.connection.setConfig(this.options);

      expect(this.connection.config.set).toHaveBeenCalledWith(this.options);
    });
  });

  describe("#getConfig", () => {
    it("should return undefined if config not exist", () => {
      let result: any = this.connection.getConfig();
      expect(result).not.toBeDefined();
    });

    it("should return the existing config", () => {
      this.connection.config = jasmine.createSpyObj("config", ["get"])
      this.connection.config.get.and.returnValue({"config": "object"});
      let result: any = this.connection.getConfig();

      expect(this.connection.config.get).toHaveBeenCalled();
      expect(result).toEqual({"config": "object"});
    });
  });

  describe("#confirmConfig", () => {
    it("should return undefined if config not exist", () => {
      let result: any = this.connection.confirmConfig();
      expect(result).not.toBeDefined();
    });

    it("should confirm the existing config", () => {
      this.connection.config = jasmine.createSpyObj("config", ["confirm"]);
      let result: any = this.connection.confirmConfig();

      expect(this.connection.config.confirm).toHaveBeenCalled();
    });

  });

  describe("#onDataOpen", () => {
    it("should set dataOpen flat to true", () => {
      expect(this.connection.isDataOpen).toBe(false);
      this.connection.onDataOpen()
      expect(this.connection.isDataOpen).toBe(true);
    });
  });

});
