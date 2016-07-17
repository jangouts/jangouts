import {
  beforeEachProviders,
  beforeEach,
  describe,
  expect,
  it,
  fakeAsync,
  tick
} from "@angular/core/testing";

import { SpeakObserver } from "./speak-observer.service";

declare const jasmine;
declare const spyOn;

describe("Service: SpeakObserver", () => {

  this.Analyser = {
    getFloatFrequencyData: function (fftBins: any): void { }
  };

  beforeEachProviders(() => [
    {provide: SpeakObserver, useClass: SpeakObserver}
  ]);

  beforeEach(() => {
    this.context = {
      resume: jasmine.createSpy("resume"),
      state: "running",
      createAnalyser: (): any => { return this.Analyser; },
      createMediaStreamSource: function (stream: any): any {
        return {
          connect: function (analyser: any): void { }
        };
      }
    };

    window.AudioContext = (): any => this.context;
  });

  describe("#destroy", () => {
    it("should call clearInterval on execute destroy method", () => {
      let speakObserver: SpeakObserver = new SpeakObserver({});
      spyOn(window, "clearInterval");

      speakObserver.destroy();

      expect(window.clearInterval).toHaveBeenCalled();
    });
  });

  describe("#isSpeaking", () => {
    it("should return not speaking when no sound", <any>fakeAsync((): void => {
      let speakObserver: SpeakObserver = new SpeakObserver({});

      tick(5000);

      expect(speakObserver.isSpeaking()).toBe(false);

      speakObserver.destroy();
    }));

    it("should return speaking when sound", <any>fakeAsync((): void => {
      let speakObserver: SpeakObserver = new SpeakObserver({});
      spyOn(this.Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
        for (let i: number = 0; i < 512; i++) {
          fftBins[i] = -5;
        };
      });

      // run 3 iterations to detect sound
      tick(65);
      tick(65);
      tick(65);

      expect(speakObserver.isSpeaking()).toBe(true);

      speakObserver.destroy();
    }));

    it("should return not speaking when sound stops", <any>fakeAsync((): void => {
      let speakObserver: SpeakObserver = new SpeakObserver({});
      let stopTalk: boolean = false;
      spyOn(this.Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
        for (let i: number = 0; i < 512; i++) {
          fftBins[i] = stopTalk ? -100 : -5;
        };
      });

      // run 3 iterations to detect sound
      tick(65);
      tick(65);
      tick(65);

      expect(speakObserver.isSpeaking()).toBe(true);

      stopTalk = true;

      for (let i: number = 0; i < 11; i++) {
        tick(65);
      }

      expect(speakObserver.isSpeaking()).toBe(false);

      speakObserver.destroy();
    }));
  });

  describe("poll audio", () => {
    it("should call AudioContext.resume when state is suspended", <any>fakeAsync((): void => {
      let speakObserver: SpeakObserver = new SpeakObserver({});

      tick(65);

      expect(this.context.resume).not.toHaveBeenCalled();
      this.context.state = "suspended";

      tick(65);

      expect(this.context.resume).toHaveBeenCalled();

      speakObserver.destroy();
    }));

    it("should call start when speaking", <any>fakeAsync((): void => {
      let start: any = jasmine.createSpy("start");
      let speakObserver: SpeakObserver = new SpeakObserver({}, {
        start: start
      });
      spyOn(this.Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
        for (let i: number = 0; i < 512; i++) {
          fftBins[i] = -5;
        };
      });

      // run 3 iterations to detect sound
      tick(65);
      tick(65);
      tick(65);

      expect(start).toHaveBeenCalled();

      speakObserver.destroy();
    }));

    it("should call stop when speaking", <any>fakeAsync((): void => {
      let stop: any = jasmine.createSpy("stop");
      let speakObserver: SpeakObserver = new SpeakObserver({}, {
        stop: stop
      });
      let stopTalk: boolean = false;
      spyOn(this.Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
        for (let i: number = 0; i < 512; i++) {
          fftBins[i] = stopTalk ? -100 : -5;
        };
      });

      // run 3 iterations to detect sound
      tick(65);
      tick(65);
      tick(65);

      stopTalk = true;

      for (let i: number = 0; i < 11; i++) {
        tick(65);
      }

      expect(stop).toHaveBeenCalled();

      speakObserver.destroy();
    }));
  });

});
