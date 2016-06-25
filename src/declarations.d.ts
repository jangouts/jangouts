interface JQuery {
    size(): number;
}

interface Room {
  id: number;
}

declare var Janus: any;

declare const VERSION: string;

interface Window {
  AudioContext?: any,
  webkitAudioContext?: any,
  Mousetrap?: any,
  Image?: any,
  Float32Array?: any
}

declare function attachMediaStream(video: any, newVal: any): void;
