import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { Feed } from "./feed.model";

declare const jasmine;
declare const spyOn;

describe("Model: Feed", () => {

  beforeEachProviders(() => {
    return [
      {provide: Feed, useClass: Feed}
    ];
  });

  beforeEach(() => {
    this.feed = new Feed();
  });

  describe("on create", () => {
    it("should be created with default attrs", () => {
      expect(this.feed.id).toBe(0);
      expect(this.feed.display).toBe(null);
      expect(this.feed.isPublisher).toBe(false);
      expect(this.feed.isLocalScreen).toBe(false);
      expect(this.feed.isIgnored).toBe(false);
      expect(this.feed.connection).toBe(null);
    });

    it("should be created with given attrs", () => {
      this.feed.setAttrs({
        id: 1,
        display: "display",
        isPublisher: true,
        isLocalScreen: true,
        isIgnored: true,
        connection: "connection"
      });

      expect(this.feed.id).toBe(1);
      expect(this.feed.display).toBe("display");
      expect(this.feed.isPublisher).toBe(true);
      expect(this.feed.isLocalScreen).toBe(true);
      expect(this.feed.isIgnored).toBe(true);
      expect(this.feed.connection).toBe("connection");
    });
  });

  describe("#isEnabled", () => {

    it("should return true for a new Feed with default attrs", () => {
      expect(this.feed.isEnabled("audio")).toBe(true);
      expect(this.feed.isEnabled("video")).toBe(true);
    });

    it("should return null for a publisher Feed without connection", () => {
      this.feed.setAttrs({
        isPublisher: true
      });

      expect(this.feed.isEnabled("audio")).toBe(null);
      expect(this.feed.isEnabled("video")).toBe(null);
    });

    it("should return the connection config values", () => {
      let connectionStatus: any = {
        audio: true,
        video: true
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      this.feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = this.feed.isEnabled("audio");
      expect(result).toBe(connectionStatus.audio);

      result = this.feed.isEnabled("video");
      expect(result).toBe(connectionStatus.video);
    });

  });

  describe("#getPicture", () => {

    it("should return null if picture not set", () => {
      expect(this.feed.getPicture()).toBe(null);
    });

    it("should return the picture setted", () => {
      this.feed.setPicture("picture");
      expect(this.feed.getPicture()).toBe("picture");
    });
  });

  describe("#setStream", () => {
    // [TODO] - Rewrite this tests with a SpeakObserver mock
    xit("should create a new SpeakObserver", () => {
      this.feed.setAttrs({
        isPublisher: true,
        isLocalScreen: false
      });
      let stream: any = {};

      this.feed.setStream(stream);

    });

    it("should set stream", () => {
      let stream: any = { id: 2 };

      this.feed.setStream(stream);
      expect(this.feed.getStream()).toBe(stream);
    });
  });


  describe("#setAudioEnabled", () => {
    it("should set remote audio for non publisher streams", () => {
      this.feed.setAttrs({
        isPublisher: false
      });

      this.feed.setAudioEnabled(true);
      expect(this.feed.getAudioEnabled()).toBe(true);
      this.feed.setAudioEnabled(false);
      expect(this.feed.getAudioEnabled()).toBe(false);
    });
  });

  describe("#getAudioEnabled", () => {
    it("should get from connection for publisher feed", () => {
      let connectionStatus: any = {
        audio: true,
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      this.feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = this.feed.getAudioEnabled();
      expect(connection.getConfig).toHaveBeenCalled();
      expect(result).toBe(connectionStatus.audio);
    });
  });

  describe("#setVideoEnabled", () => {
    it("should set remote video for non publisher streams", () => {
      this.feed.setAttrs({
        isPublisher: false
      });

      this.feed.setVideoEnabled(true);
      expect(this.feed.getVideoEnabled()).toBe(true);
      this.feed.setVideoEnabled(false);
      expect(this.feed.getVideoEnabled()).toBe(false);
    });
  });

  describe("#getVideoEnabled", () => {
    it("should get from connection for publisher feed", () => {
      let connectionStatus: any = {
        video: true
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      this.feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = this.feed.getVideoEnabled();
      expect(result).toBe(connectionStatus.video);
    });
  });

  describe("#isDataOpen", () => {
    it("should get from connection when is defined", () => {
      let connection: any = {
        isDataOpen: true
      };
      this.feed.setAttrs({
        connection: connection
      });

      expect(this.feed.isDataOpen()).toBe(connection.isDataOpen);
    });

    it("should return false when connection is not defined", () => {
      expect(this.feed.isDataOpen()).toBe(false);
    });
  });

  describe("#isConnected", () => {
    it("should return false if connection is not defined", () => {
      expect(this.feed.isConnected()).toBe(false);
    });

    it("should return true if connection is defined", () => {
      this.feed.setAttrs({ connection: {} });

      expect(this.feed.isConnected()).toBe(true);
    });
  });

  describe("#ignore", () => {
    it("should destroy the connection", () => {
      let connection: any = {
        destroy: jasmine.createSpy("connection.destroy")
      };
      this.feed.setAttrs({ connection: connection });

      this.feed.ignore();

      expect(this.feed.isConnected()).toBe(false);
      expect(connection.destroy).toHaveBeenCalled();
    });
  });


  describe("#stopIgnoring", () => {
    it("should set the feed as connected", () => {
      this.feed.setAttrs({});
      this.feed.ignore();

      expect(this.feed.isConnected()).toBe(false);
      this.feed.stopIgnoring({});

      expect(this.feed.isConnected()).toBe(true);
    });
  });

  describe("#waitingForConnection", () => {
    it("should return false when connection is defined", () => {
      this.feed.setAttrs({});

      expect(this.feed.waitingForConnection()).toBe(true);
    });

    it("should return false when connection is not defined but is ignored", () => {
      this.feed.setAttrs({});
      this.feed.disconnect();
      this.feed.ignore();

      expect(this.feed.waitingForConnection()).toBe(false);
    });

    it("should return true when connection is not defined", () => {
      this.feed.setAttrs({});
      this.feed.disconnect();

      expect(this.feed.waitingForConnection()).toBe(true);
    });

    it("should return false when connection is defined but is ignored", () => {
      this.feed.setAttrs({});
      this.feed.ignore();

      expect(this.feed.waitingForConnection()).toBe(false);
    });
  });

  describe("#setEnabledChannel", () => {
    it("should set connection config if feed is publisher", () => {
      this.feed.isPublisher = true;
      this.feed.connection = jasmine.createSpyObj("connection", ["setConfig"]);
      this.feed.setEnabledChannel("audio", true);

      expect(this.feed.connection.setConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({
          values: {
            audio: true
          },
          ok: jasmine.any(Function)
        })
      );
    });

    it("should send new status to remote peers", () => {
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendStatus"]);
      this.feed.isPublisher = true;
      this.feed.connection = jasmine.createSpyObj("connection", ["setConfig"]);
      this.feed.connection.setConfig.and.callFake((options) => {
        options.ok();
      });

      this.feed.setEnabledChannel("audio", false);

      expect(this.feed.dataChannel.sendStatus).toHaveBeenCalledWith(
        this.feed,
        jasmine.objectContaining({exclude: "picture"})
      );
    });

    it("should call after callback", () => {
      this.feed.isPublisher = true;
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendStatus"]);
      let options: any = jasmine.createSpyObj("options", ["after"]);
      this.feed.connection = jasmine.createSpyObj("connection", ["setConfig"]);
      this.feed.connection.setConfig.and.callFake((options) => {
        options.ok();
      });

      this.feed.setEnabledChannel("audio", true, options);

      expect(options.after).toHaveBeenCalled();

    });

    it("should send mute request if channel audio is disabled for non publisher feed", () => {
      this.feed.isPublisher = false;
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendMuteRequest"]);
      this.feed.connection = jasmine.createSpyObj("connection", ["setConfig"]);
      this.feed.setEnabledChannel("audio", false);

      expect(this.feed.dataChannel.sendMuteRequest).toHaveBeenCalledWith(this.feed);
    });
  });

  describe("#updateLocalSpeaking", () => {
    it("should notify changes to remote peers", () => {
      this.feed.speaking = true;
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendStatus"]);

      this.feed.updateLocalSpeaking(false);

      expect(this.feed.dataChannel.sendStatus).toHaveBeenCalledWith(
        this.feed,
        jasmine.objectContaining({exclude: "picture"})
      );
    });

    it("should not notify remote peers if value not changes", () => {
      this.feed.speaking = true;
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendStatus"]);

      this.feed.updateLocalSpeaking(true);

      expect(this.feed.dataChannel.sendStatus).not.toHaveBeenCalled();
    });

  });

  describe("#updateLocalPic", () => {
    it("should notify changes to remote peers", () => {
      this.feed.dataChannel = jasmine.createSpyObj("dataChannel", ["sendStatus"]);

      this.feed.updateLocalPic("newpic");

      expect(this.feed.dataChannel.sendStatus).toHaveBeenCalledWith(this.feed);
    });
  });

  describe("#getStatus", () => {
    it("should return a representation of the feed", () => {
      spyOn(this.feed, "getAudioEnabled").and.returnValue(true);
      spyOn(this.feed, "getVideoEnabled").and.returnValue(true);
      spyOn(this.feed, "getSpeaking").and.returnValue(false);
      spyOn(this.feed, "getPicture").and.returnValue("pic");

      expect(this.feed.getStatus()).toEqual(jasmine.objectContaining({
        audioEnabled: true,
        videoEnabled: true,
        speaking: false,
        picture: "pic"
      }));
    });
  });

  describe("#setStatus", () => {
    it("should set given status", () => {
      spyOn(this.feed, "setAudioEnabled");
      spyOn(this.feed, "setVideoEnabled");
      spyOn(this.feed, "setSpeaking");
      spyOn(this.feed, "setPicture");

      this.feed.setStatus({
        audioEnabled: true,
        videoEnabled: true,
        speaking: false,
        picture: "pic"
      });

      expect(this.feed.setAudioEnabled).toHaveBeenCalledWith(true);
      expect(this.feed.setVideoEnabled).toHaveBeenCalledWith(true);
      expect(this.feed.setSpeaking).toHaveBeenCalledWith(false);
      expect(this.feed.setPicture).toHaveBeenCalledWith("pic");
    });
  });

  describe("#isSilent", () => {
    it("should return false if feed is speaking", () => {
      this.feed.speaking = true;
      expect(this.feed.isSilent()).toBe(false);
    });

    it("should return false if feed was speaking in a given time", () => {
      this.feed.speaking = false;
      this.feed.silentSince = (Date.now() - 1000);

      expect(this.feed.isSilent(5000)).toBe(false);
    });

    it("should return true if feed is not speaking in a given time", () => {
      this.feed.speaking = false;
      this.feed.silentSince = (Date.now() - 10000);

      expect(this.feed.isSilent(5000)).toBe(true);
    });
  });

  describe("#setVideoSubscription", () => {
    it("should set connection config with new video value", () => {
      this.feed.connection = jasmine.createSpyObj("connecion", ["setConfig"]);

      this.feed.setVideoSubscription("new video");

      expect(this.feed.connection.setConfig).toHaveBeenCalledWith(
        jasmine.objectContaining({
          values: {
            video: "new video"
          }
        })
      );
    });
  });

  describe("#getVideoSubscription", () => {
    it("should return null if connection is not defined", () => {
      expect(this.feed.getVideoSubscription()).toBe(null);
    });

    it("should return the connection config for video", () => {
      this.feed.connection = jasmine.createSpyObj("connecion", ["getConfig"]);
      this.feed.connection.getConfig.and.returnValue({video: "new video"});

      expect(this.feed.getVideoSubscription()).toEqual("new video");
    });
  });

});
