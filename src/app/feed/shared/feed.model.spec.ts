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

describe("Service: Feed", () => {

  beforeEachProviders(() => {
    return [
      {provide: Feed, useClass: Feed}
    ];
  });

  beforeEach(() => {
  });

  it("should be created with default attrs", () => {
    let feed: Feed = new Feed();

    expect(feed.id).toBe(0);
    expect(feed.display).toBe(null);
    expect(feed.isPublisher).toBe(false);
    expect(feed.isLocalScreen).toBe(false);
    expect(feed.isIgnored).toBe(false);
    expect(feed.connection).toBe(null);
  });

  it("should be created with given attrs", () => {
    let feed: Feed = new Feed();
    feed.setAttrs({
      id: 1,
      display: "display",
      isPublisher: true,
      isLocalScreen: true,
      isIgnored: true,
      connection: "connection"
    });

    expect(feed.id).toBe(1);
    expect(feed.display).toBe("display");
    expect(feed.isPublisher).toBe(true);
    expect(feed.isLocalScreen).toBe(true);
    expect(feed.isIgnored).toBe(true);
    expect(feed.connection).toBe("connection");
  });

  describe("isEnabled", () => {

    it("should return true for a new Feed with default attrs", () => {
      let feed: Feed = new Feed();

      expect(feed.isEnabled("audio")).toBe(true);
      expect(feed.isEnabled("video")).toBe(true);
    });

    it("should return null for a publisher Feed without connection", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: true
      });

      expect(feed.isEnabled("audio")).toBe(null);
      expect(feed.isEnabled("video")).toBe(null);
    });

    it("should call connection.getConfig with connection and publisher", () => {
      let connectionStatus: any = {
        audio: true,
        video: true
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = feed.isEnabled("audio");
      expect(connection.getConfig).toHaveBeenCalled();
      expect(result).toBe(connectionStatus.audio);

      result = feed.isEnabled("video");
      expect(result).toBe(connectionStatus.video);
    });

  });

  describe("getPicture", () => {

    it("should return null if picture not set", () => {
      let feed: Feed = new Feed();

      expect(feed.getPicture()).toBe(null);
    });

    it("should return the picture setted", () => {
      let feed: Feed = new Feed();

      feed.setPicture("picture");
      expect(feed.getPicture()).toBe("picture");
    });
  });

  describe("setStream", () => {
    // [TODO] - Rewrite this tests with a SpeakObserver mock
    xit("should call SpeakObserver when isPublisher and not localScreen", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: true,
        isLocalScreen: false
      });
      let stream: any = {};


      feed.setStream(stream);

    });

    it("should set stream", () => {
      let feed: Feed = new Feed();
      let stream: any = { id: 2 };

      feed.setStream(stream);
      expect(feed.getStream()).toBe(stream);
    });
  });


  describe("AudioEnabled", () => {
    it("should set remote audio for non publisher streams", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: false
      });

      feed.setAudioEnabled(true);
      expect(feed.getAudioEnabled()).toBe(true);
      feed.setAudioEnabled(false);
      expect(feed.getAudioEnabled()).toBe(false);
    });

    it("should call connection.getConfig when get audio for publisher feed", () => {
      let connectionStatus: any = {
        audio: true,
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = feed.getAudioEnabled();
      expect(connection.getConfig).toHaveBeenCalled();
      expect(result).toBe(connectionStatus.audio);
    });
  });

  describe("VideoEnabled", () => {
    it("should set remote video for non publisher streams", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: false
      });

      feed.setVideoEnabled(true);
      expect(feed.getVideoEnabled()).toBe(true);
      feed.setVideoEnabled(false);
      expect(feed.getVideoEnabled()).toBe(false);
    });

    it("should call connection.getConfig when get video for publisher feed", () => {
      let connectionStatus: any = {
        video: true
      };
      let connection: any = {
        getConfig: jasmine.createSpy("connection.getConfig").and.callFake(() => {
          return connectionStatus;
        })
      };
      let feed: Feed = new Feed();
      feed.setAttrs({
        isPublisher: true,
        connection: connection
      });

      let result: boolean = feed.getVideoEnabled();
      expect(connection.getConfig).toHaveBeenCalled();
      expect(result).toBe(connectionStatus.video);
    });
  });

  describe("voiceDetected", () => {
    // [TODO] - Enable this test with SpeakObserver Mock
    xit("should voiceDetected", () => {
    });
  });

  describe("isDataOpen", () => {
    it("should return connection.isDataOpen when connection is defined", () => {
      let connection: any = {
        isDataOpen: true
      };
      let feed: Feed = new Feed();
      feed.setAttrs({
        connection: connection
      });

      expect(feed.isDataOpen()).toBe(connection.isDataOpen);
    });
    it("should return false when connection is not defined", () => {
      let feed: Feed = new Feed();

      expect(feed.isDataOpen()).toBe(false);
    });
  });

  describe("isConnected", () => {
    it("should return false if not connection setted", () => {
      let feed: Feed = new Feed();

      expect(feed.isConnected()).toBe(false);
    });
    it("should return true if connection setted", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({
        connection: {}
      });

      expect(feed.isConnected()).toBe(true);
    });
  });

  describe("disconnect", () => {
    it("should set isConnected to false",  () => {
      let feed: Feed = new Feed();
      feed.disconnect();
      expect(feed.isConnected()).toBe(false);
    });

    it("should call connection destroy", () => {
      let connection: any = {
        destroy: jasmine.createSpy("connection.destroy")
      };
      let feed: Feed = new Feed();
      feed.setAttrs({
        connection: connection
      });

      feed.disconnect();
      expect(connection.destroy).toHaveBeenCalled();
    });
  });

  describe("igonre", () => {

    it("should call feed.disconnect on ignore feed", () => {
      let feed: Feed = new Feed();
      spyOn(feed, "disconnect");

      feed.ignore();

      expect(feed.disconnect).toHaveBeenCalled();
    });

    it("should be connected when call stopIgnoring", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({});
      feed.ignore();

      expect(feed.isConnected()).toBe(false);
      feed.stopIgnoring({});

      expect(feed.isConnected()).toBe(true);
    });
  });

  describe("waitingForConnection", () => {
    it("should return false when connection is setted", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({});

      expect(feed.waitingForConnection()).toBe(true);
    });

    it("should return false when connection is not setted but is ignored", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({});
      feed.disconnect();
      feed.ignore();

      expect(feed.waitingForConnection()).toBe(false);
    });

    it("should return true when connection is not setted", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({});
      feed.disconnect();

      expect(feed.waitingForConnection()).toBe(true);
    });

    it("should return false when connection is set but is ignored", () => {
      let feed: Feed = new Feed();
      feed.setAttrs({});
      feed.ignore();

      expect(feed.waitingForConnection()).toBe(false);
    });

  });

});
