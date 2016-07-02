/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";
import { ISpeakerOptions, SpeakObserver } from "./speak-observer.service";

/**
 * Retresents a Janus feed
 */
@Injectable()
export class Feed {

  public id: number = 0;
  public display: string = null;
  public isPublisher: boolean = false;
  public isLocalScreen: boolean = false;
  public isIgnored: boolean = false;
  public connection: any = null;

  private picture: string = null;
  private speaking: boolean = false;
  private silentSince: number = Date.now();
  private videoRemoteEnabled: boolean = true;
  private audioRemoteEnabled: boolean = true;
  private stream: any = null;
  private speakObserver: any = null;
  private dataChannel: any = null;

  /*
   * Constructor should only require injected parameters, this is the reason to
   * has setAttrs method. When full app upgraded to Angular 2 DataChannel service
   * should be injected in the consturctor.
   */
  constructor () {}

  public setAttrs(attrs: any = {}): void {
    this.id = attrs.id || 0;
    this.display = attrs.display || null;
    this.isPublisher = attrs.isPublisher || false;
    this.isLocalScreen = attrs.isLocalScreen || false;
    this.isIgnored = attrs.isIgnored || false;
    this.connection = attrs.connection || null;
    this.dataChannel = attrs.dataChannel || null;
  }

  /**
   * Checks if a given channel is enabled
   * @param channel   "audio" or "video"
   */
  // should change channel to typescript enums?
  public isEnabled(channel: string): boolean {
    if (this.isPublisher) {
      if (this.connection && this.connection.getConfig()) {
        return this.connection.getConfig()[channel];
      } else {
        return null;
      }
    } else {
      return (channel === "audio") ? this.audioRemoteEnabled : this.videoRemoteEnabled;
    }
  }

  /**
   * Sets picture for picture channel
   * @param val path to picture
   */
  public setPicture (val: string): void {
    this.picture = val;
  }

  /**
   * Gets picture for picture channel
   * @returns path to picture
   */
  public getPicture(): string {
    return this.picture;
  }

  /**
   * Sets janus stream for the feed
   * @param val janus stream
   */
  public setStream(val: any): void {
    if (this.isPublisher && !this.isLocalScreen) {
      let options: ISpeakerOptions = {
        start: (): void => this.updateLocalSpeaking(true),
        stop: (): void => this.updateLocalSpeaking(false)
      };
      this.speakObserver = new SpeakObserver(val, options);
    }
    this.stream = val;
  }

  /**
   * Gets janus stream for the feed
   * @returns janus stream
   */
  public getStream(): any {
    return this.stream;
  }

  /**
   * Sets speaking flag
   * @param flag true if feed speaking
   */
  public setSpeaking(flag: boolean): void {
    this.speaking = flag;
  }

  /**
   * Gets feed speaking flag
   * @return true if feed speaking
   */
  public getSpeaking(): boolean {
    return this.speaking;
  }

  /**
   * Sets if audio is enabled for this feed. Works only for remote ones.
   */
  public setAudioEnabled(val: boolean): void {
    this.audioRemoteEnabled = val;
  }

  /**
   * Gets if audio is enabled for this feed
   */
  public getAudioEnabled(): boolean {
    return this.isEnabled("audio");
  }

  /**
   * Sets if video is enabled for this feed. Works only for remote ones.
   */
  public setVideoEnabled(val: boolean): void {
    this.videoRemoteEnabled = val;
  }

  /**
   * Gets if video is enabled for this feed
   */
  public getVideoEnabled(): boolean {
    return this.isEnabled("video");
  }

  /**
   * Checks if audio is being currently detected in the local feed
   */
  public isVoiceDetected(): boolean {
    return this.speakObserver && this.speakObserver.isSpeaking();
  }

  /**
   * Checks if data channel is open
   */
  public isDataOpen(): boolean {
    if (this.connection) {
      return this.connection.isDataOpen;
    } else {
      return false;
    }
  }

  /**
   * Checks if the feed is connected to janus.
   */
  public isConnected(): boolean {
    return (this.connection !== null);
  }

  /**
   * Disconnects from janus
   */
  public disconnect(): void {
    if (this.connection) {
      this.connection.destroy();
    }
    if (this.speakObserver) {
      this.speakObserver.destroy();
    }
    this.connection = null;
  }

  /**
   * Starts ignoring the feed
   */
  public ignore(): void {
    this.isIgnored = true;
    this.disconnect();
  }

  /**
   * Stops ignoring the feed
   * @param connection new connection to Janus
   */
  public stopIgnoring(connection: any): void {
    this.isIgnored = false;
    this.connection = connection;
  };

  /**
   * Checks if the feed is waiting for the connection to janus to be set
   */
  public waitingForConnection(): boolean {
    return (this.isIgnored === false && !this.connection);
  }

  /**
   * Enables or disables the given channel
   *
   * If the feed is a publisher, it directly configures the connection to
   * Janus. If the feed is a subscriber, it request the configuration change
   * to the remote peer (only for audio, management of remote video is not
   * implemented).
   *
   * @param type "audio" or "video"
   * @param enabled
   * @param options use the 'after' key to specify a callback that will be called
   *                after configuring the connection.
   */
  public setEnabledChannel(type: string, enabled: boolean, options: any = {}): void {
    let that: any = this;

    if (this.isPublisher) {
      let config: any = {};
      config[type] = enabled;
      this.connection.setConfig({
        values: config,
        ok: (): void => {
          if (type === "audio" && enabled === false) {
            that.speaking = false;
          }
          if (options.after) { options.after(); }
          // send the new status to remote peers
          this.dataChannel.sendStatus(this, {exclude: "picture"});
        }
      });
      if (type === "video") {
        let tracks: any = this.stream.getVideoTracks();
        if (tracks !== null && tracks !== undefined) {
          tracks[0].enabled = enabled;
        }
      }
    } else if (type === "audio" && enabled === false) {
      this.dataChannel.sendMuteRequest(this);
    }
  }

  /**
   * Sets the value of the speaking attribute for this publisher feed,
   * honoring the value of audioEnabled and notifying changes to the
   * remote peers if needed.
   */
  public updateLocalSpeaking(val: boolean): void {
    if (this.isEnabled("audio") === false) {
      val = false;
    }
    if (this.speaking !== val) {
      this.speaking = val;
      if (val === false) { this.silentSince = Date.now(); }
      this.dataChannel.sendStatus(this, {exclude: "picture"});
    }
  }

  /**
   * Sets the value of the picture attribute for this publisher feed,
   * notifying changes to the remote peers.
   */
  public updateLocalPic(data: string): void {
    this.picture = data;
    this.dataChannel.sendStatus(this);
  }

  /**
   * Reads the representation of the local feed in order to send it to the
   * remote peers.
   * @param options use the 'exclude' key to specify a list of attributes
   *                that should not be included (as array of strings)
   * @returns attribute values
   */
  public getStatus(options: any = {}): any {
    if (!options.exclude) { options.exclude = []; }

    let attrs: Array<string> = ["audioEnabled", "videoEnabled", "speaking", "picture"];
    let status: any = {};

    _.forEach(attrs, (attr) => {
      if (!_.includes(options.exclude, attr)) {
        status[attr] = this[`get${_.upperFirst(attr)}`]();
      }
    });
    return status;
  }

  /**
   * Update local representation of the feed (used to process information
   * sent by the remote peer)
   */
  public setStatus(attrs: any): void {
    if (this.speaking === true && attrs.speaking === false) {
      this.silentSince = Date.now();
    }
    _.forEach(attrs, (value, attr) => this[`set${_.upperFirst(attr)}`](value));
  }
  /**
   * Checks if the feed audio is inactive and, thus, can be hidden or
   * rendered as a stream of pictures instead of a video
   */
  public isSilent(threshold: number = 6000): boolean {
    return !this.speaking && this.silentSince < (Date.now() - threshold);
  }

  /**
   * Enables or disables the video of the connection to Janus
   */
  public setVideoSubscription(value: any): void {
    this.connection.setConfig({values: {video: value}});
  }

  /**
   * Gets the status of the video flag of the connection to Janus
   */
  public getVideoSubscription(): boolean {
    if (this.connection && this.connection.getConfig()) {
      return this.connection.getConfig().video;
    } else {
      return null;
    }
  }

}
