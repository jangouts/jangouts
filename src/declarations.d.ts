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

declare module 'zone.js/dist/zone' {
    export var Zone; // this doesn't actually do anything just makes the compiler not complain about the empty module
}
declare module 'zone.js/dist/long-stack-trace-zone' {
    export var Zone; // this doesn't actually do anything just makes the compiler not complain about the empty module
}
