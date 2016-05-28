/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from 'lodash';

speakObserverFactory.$inject = ['$interval'];

/**
 * Observes an audio stream, detecting when somebody starts or stops speaking.
 *
 * Heavily inspired by Hark https://github.com/otalk/hark
 *
 * @constructor
 */
function speakObserverFactory($interval) {
  return function(stream, options) {
    options = options || {};
    var interval = options.interval || 65;
    var threshold = options.threshold || -50;

    var AudioContextType = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContextType();
    // Setup an analyser
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.1;
    var fftBins = new window.Float32Array(analyser.fftSize);
    // Setup a source node and connect it to the analyser
    var sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyser);

    var speaking = false;
    var history = _.fill(new Array(10), 0);

    var loop = $interval(function () {
      // No clue why, but in some situations (which seems to be different in
      // every browser) audioContext is suspended.
      //
      // For that reason, using a ScriptProcessor is unreliable and we have to
      // use $timeout, including this code to manually wake up the context
      if (audioContext.state === "suspended") {
        audioContext.resume();
      } else {
        poll();
      }
    }, interval);

    this.destroy = function() {
      $interval.cancel(loop);
    };

    this.isSpeaking = function() {
      return speaking;
    };

    function poll() {
      var audioDetected = isAudioDetected();
      var sum;

      if (audioDetected && !speaking) {
        // Make sure we have been above the threshold in, at least, 2 of the 3
        // previous iterations
        sum = _.sum(_.slice(history, history.length - 3));
        if (sum >= 2) {
          speaking = true;
          if (options.start) { options.start(); }
        }
      } else if (!audioDetected && speaking) {
        // Make sure we have been below the threshold for the whole history
        // (i.e. 10 iterations)
        sum = _.sum(history);
        if (sum === 0) {
          speaking = false;
          if (options.stop) { options.stop(); }
        }
      }
      history.shift();
      history.push( audioDetected ? 1 : 0);
    }

    function isAudioDetected() {
      analyser.getFloatFrequencyData(fftBins);
      // Skip the first 4... simply because hark does it
      // (too low frequencies to be voice, I guess)
      for(var i=4, ii=fftBins.length; i < ii; i++) {
        if (fftBins[i] > threshold && fftBins[i] < 0) {
          return true;
        }
      }
      return false;
    }
  };
}

export default speakObserverFactory;
