/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

export interface ISpeakerOptions {
  interval?: number;
  threshold?: number;
  start?(): void;
  stop?(): void;
}

/**
 * Observes an audio stream, detecting when somebody starts or stops speaking.
 *
 * Heavily inspired by Hark https://github.com/otalk/hark
 */
export class SpeakObserver {

  private threshold: number;
  private analyser: any;
  private fftBins: any;
  private speaking: boolean = false;
  private history: Array<number>;
  private intervalID: any;
  private start: any;
  private stop: any;

  constructor(stream: any, options: ISpeakerOptions = {}) {
    let interval: number  = options.interval || 65;
    this.threshold = options.threshold || -50;

    this.start = options.start;
    this.stop = options.stop;

    let audioContext: any = new (window.AudioContext || window.webkitAudioContext)();
    // setup an analyser
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.1;
    this.fftBins = new window.Float32Array(this.analyser.fftSize);
    // setup a source node and connect it to the analyser
    let sourceNode: any = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(this.analyser);

    this.history = _.fill(new Array(10), 0);

    this.intervalID = setInterval(() => {
      /**
       * No clue why, but in some situations (which seems to be different in
       * every browser) audioContext is suspended.
       *
       * For that reason, using a ScriptProcessor is unreliable and we have to
       * use $timeout, including this code to manually wake up the context
       */
      if (audioContext.state === "suspended") {
        audioContext.resume();
      } else {
        this.poll();
      }
    }, interval);
  }

  public destroy(): void {
    clearInterval(this.intervalID);
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }

  private poll(): void {
    let audioDetected: any = this.isAudioDetected();
    let sum: number;

    if (audioDetected && !this.speaking) {
      // make sure we have been above the threshold in, at least, 2 of the 3
      // previous iterations
      sum = _.sum(_.slice(this.history, this.history.length - 3));
      if (sum >= 2) {
        this.speaking = true;
        if (this.start) { this.start(); }
      }
    } else if (!audioDetected && this.speaking) {
      // make sure we have been below the threshold for the whole history
      // (i.e. 10 iterations)
      sum = _.sum(this.history);
      if (sum === 0) {
        this.speaking = false;
        if (this.stop) { this.stop(); }
      }
    }

    this.history.shift();
    this.history.push( audioDetected ? 1 : 0 );
  }

  private isAudioDetected(): boolean {
    this.analyser.getFloatFrequencyData(this.fftBins);
    // skip the first 4... simply because hark does it
    // (too low frequencies to be voice, I guess)
    for (var i: number = 4, ii: number = this.fftBins.length; i < ii; i++) {
      if (this.fftBins[i] > this.threshold && this.fftBins[i] < 0) {
        return true;
      }
    }
    return false;
  }
}
