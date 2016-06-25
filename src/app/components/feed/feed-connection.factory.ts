/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from '@angular/core';
import { ConnectionConfig, IWanted, IOptions } from "./connection-config.factory";

interface IMedia {
  videoRecv: boolean;
  audioRecv: boolean;
  videoSend?: boolean;
  audioSend?: boolean;
  data?: boolean;
  video?: string;
}

/**
 * Manages the connection of a feed to the Janus server
 */
@Injectable()
export class FeedConnection {

  public pluginHandle: any;
  public role: string;
  public isDataOpen: boolean = false;
  public config: any = null;
  public roomId: number;

  constructor() {}

  public setAttrs(pluginHandle: any, roomId: number, role: string = "subscriber"): void {
    this.pluginHandle = pluginHandle;
    this.role = role;
    this.roomId = roomId;

    console.log(`${this.role} plugin attached (${pluginHandle.getPlugin()}, id=${pluginHandle.getId()})`);
  }

  public destroy(): void {
    this.config = null;
    this.pluginHandle.detach();
  }

  public register(display: any): void {
    let register: any = {
      request: "join",
      room: this.roomId,
      ptype: "publisher",
      display: display
    };
    this.pluginHandle.send({"message": register});
  }

  public listen(feedId: number): void {
    let listen: any = {
      request: "join",
      room: this.roomId,
      ptype: "listener",
      feed: feedId
    };
    this.pluginHandle.send({"message": listen});
  }

  public handleRemoteJsep(jsep: any): void {
    this.pluginHandle.handleRemoteJsep({jsep: jsep});
  }

  public sendData(data: any): void {
    this.pluginHandle.data(data);
  }

  /**
   * Negotiates WebRTC by creating a webRTC offer for sharing the audio and
   * (optionally) video with the janus server. The audio is optionally muted.
   * On success (the stream is created and accepted), publishes the corresponding
   * feed on the janus server.
   *
   * @param options object with the noCamera boolean flag, muted boolean flag,
   *                and some callbacks (success, error)
   */
  public publish(options: any = {}): void {
    let media: IMedia = {videoRecv: false, audioRecv: false};
    let cfg: IWanted = {video: true, audio: true};

    if (this.role === "main") {
      if (options.muted) {
        cfg.audio = false;
      }
      if (options.noCamera) {
        media.videoSend = false;
        cfg.video = false;
      } else {
        media.videoSend = true;
      }
      media.audioSend = true;
      media.data = true;
    } else {
      cfg.audio = false;
      media.video = "screen";
      media.audioSend = false;
      media.data = false;
    }

    this.pluginHandle.createOffer({
      media: media,
      success: (jsep: any): void => {
        console.log("Got publisher SDP!");
        console.log(jsep);
        this.config = new ConnectionConfig(this.pluginHandle, cfg, jsep, undefined);
        // call the provided callback for extra actions
        if (options.success) { options.success(); }
      },
      error: (error: any): void => {
        console.error("WebRTC error publishing");
        console.error(error);
        // call the provided callback for extra actions
        if (options.error) { options.error(); }
      }
    });
  }

  /**
   * Negotiates WebRTC by creating a WebRTC answer for subscribing to
   * to a feed from the janus server.
   */
  public subscribe(jsepVal: any): void {
    this.pluginHandle.createAnswer({
      jsep: jsepVal,
      media: {
        audioSend: false,
        videoSend: false,
        data: true
      },
      success: (jsep: any): void => {
        console.log("Got SDP!");
        console.log(jsep);
        let start: any = { "request": "start", "room": this.roomId };
        this.pluginHandle.send({message: start, jsep: jsep});
      },
      error: (error: any): void => {
        console.error("WebRTC error subscribing");
        console.error(error);
      }
    });
  }

  /**
   * Sets the configuration flags
   *
   * @param options object containing
   *                * values: object with the wanted values for the flags
   *                * ok: callback to execute on confirmation from Janus
   */
  public setConfig(options: IOptions): void {
    if (this.config) {
      this.config.set(options);
    } else {
      this.config = new ConnectionConfig(this.pluginHandle, options.values, null, options.ok);
    }
  };

  /**
   * Gets the configuration flags
   * @returns values of the audio and video flags
   */
  public getConfig(): any {
    if (this.config) {
      return this.config.get();
    }
    return;
  }

  /**
   * Processes the confirmation (received from Janus) of the ongoing config
   * request
   */
  public confirmConfig(): any {
    if (this.config) {
      return this.config.confirm();
    }
    return;
  }

  /**
   * Handler for the ondataopen event
   */
  public onDataOpen(): void {
    this.isDataOpen = true;
  }

}
