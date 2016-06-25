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

describe("Service: SpeakObserver", () => {

  let audioContextState: string = "running";
  let MediaStreamSource: any = {
    connect: function (analyser: any): void { }
  };

  let Analyser: any = {
    getFloatFrequencyData: function (fftBins: any): void { }
  };

  let resume: any = jasmine.createSpy("resume");
  let ctx: any = {};

  beforeEachProviders(() => [
    SpeakObserver,
  ]);

  beforeEach(() => {
    audioContextState = "running";
    ctx = {
      resume: resume,
      state: audioContextState,
      createAnalyser: function (): any { return Analyser; },
      createMediaStreamSource: function (stream: any): any {
        return MediaStreamSource;
      }
    };
    window.AudioContext = function (): any {
      return ctx;
    };
  });

  it("should have destroy method defined", () => {
    let speakObserver: SpeakObserver = new SpeakObserver({});

    expect(speakObserver.destroy).toBeDefined();
  });

  it("should have destroy method defined with webkitAudioContext", () => {
    delete window.AudioContext;
    window.webkitAudioContext = function (): any {
      return ctx;
    };

    let speakObserver: SpeakObserver = new SpeakObserver({});

    expect(speakObserver.destroy).toBeDefined();
  });

  it("should call clearInterval on execute destroy method", () => {
    let speakObserver: SpeakObserver = new SpeakObserver({});
    spyOn(window, "clearInterval");

    speakObserver.destroy();

    expect(window.clearInterval).toHaveBeenCalled();
  });

  it("should return not speaking when no sound", <any>fakeAsync((): void => {
    let speakObserver: SpeakObserver = new SpeakObserver({});

    tick(5000);

    expect(speakObserver.isSpeaking()).toBe(false);

    speakObserver.destroy();
  }));

  it("should return speaking when sound", <any>fakeAsync((): void => {
    let speakObserver: SpeakObserver = new SpeakObserver({});
    spyOn(Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
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

  it("should call AudioContext.resume when state is suspended", <any>fakeAsync((): void => {
    let speakObserver: SpeakObserver = new SpeakObserver({});

    tick(65);

    expect(resume).not.toHaveBeenCalled();
    ctx.state = "suspended";


    tick(65);

    expect(resume).toHaveBeenCalled();

    speakObserver.destroy();
  }));

  it("should return not speaking when sound stops", <any>fakeAsync((): void => {
    let speakObserver: SpeakObserver = new SpeakObserver({});
    let stopTalk: boolean = false;
    spyOn(Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
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

  it("should call start when speaking", <any>fakeAsync((): void => {
    let start: any = jasmine.createSpy("start");
    let speakObserver: SpeakObserver = new SpeakObserver({}, {
      start: start
    });
    spyOn(Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
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
    spyOn(Analyser, "getFloatFrequencyData").and.callFake((fftBins: any) => {
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
