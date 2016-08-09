import {
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";


import { Config } from "./config.provider";

declare const jasmine: any;
declare const spyOn: any;

describe("Service: Config", () => {

  beforeEach(() => {
    this.config = new Config();
  });

  describe("janusServer", () => {

    it("should return default janus server", () => {
      expect(this.config.janusServer).toEqual([
        "ws://localhost:8188/janus/",
        "http://localhost/janus/"
      ]);
    });

    it("should return the defined janus server if it is setted", () => {
      let server: string [] = [
        "ws://janustest.com:8188/path/",
        "http://janustest.com/path/"
      ];
      this.config.janusServer = server;

      expect(this.config.janusServer).toBe(server);
    });

  });

  describe("httpsUrl", () => {

    it("should return null if https not available", () => {
      this.config.httpsAvailable = false;

      expect(this.config.httpsUrl).toBe(null);
    });

    it("should return https url from window.location", () => {
      expect(this.config.httpsUrl).toEqual(
        `https://${window.location.hostname}${window.location.pathname}`
      );
    });

    it("should return defined https url if it is setted", () => {
      this.config.httpsUrl = "https://janustest.com/path";
      expect(this.config.httpsUrl).toEqual("https://janustest.com/path");
    });

  });

});
