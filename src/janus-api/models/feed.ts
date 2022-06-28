/*
 * Copyright (c) [2015-2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createSpeakObserver } from './speak-observer';

type FeedArgs = {
  id: number, display: string, isPublisher: boolean, isLocalScreen: boolean, connection: any,
  dataChannelService: any, eventsService: any, ignored: boolean
};

type AudioOrVideo = "audio" | "video";

// Maps janusApi attributes to instance methods
const apiAttrs : {
  [key in string]: string
} = {
  // TODO: local is temporary. It actually belongs to Participant, not to Feed.
  id: 'id', screen: 'localScreen', local: 'publisher', name: 'display', ignored: 'ignored',
  speaking: 'speaking', audio: 'audioEnabled', video: 'videoEnabled', picture: 'picture',
  connected: 'connected'
};

const statusAttrs = ['name', 'speaking', 'audio', 'video', 'picture', 'connected'];

export class Feed {
  id: number = 0;
  display: string;
  publisher: boolean;
  localScreen: boolean;
  ignored: boolean;
  connection: any;
  private dataChannelService: any;
  private eventsService: any;
  private picture: string | null = null; // FIXME: is still used?
  private speaking: boolean = false;
  private silentSince: number;
  private stream: MediaStream | null = null;
  private speakObserver: any;
  private videoRemoteEnabled: boolean = true;
  private audioRemoteEnabled: boolean = true;

  constructor({
    id, display, isPublisher, isLocalScreen, connection, ignored, dataChannelService, eventsService
  }: FeedArgs) {
    this.id = id;
    this.display = display;
    this.publisher = isPublisher;
    this.localScreen = isLocalScreen;
    this.ignored = ignored; // is still used?
    this.connection = connection;
    this.dataChannelService = dataChannelService;
    this.eventsService = eventsService;
    this.silentSince = Date.now();
  }

  /**
   * Checks if a given channel is enabled
   *
   * @param {string} channel - "audio" or "video"
   * @returns {?boolean}
   */
  isEnabled(channel: AudioOrVideo): boolean | null {
    if (this.publisher) {
      if (this.connection) {
        console.log("Conneciton", this.connection);
        const config = this.connection.getConfig();
        return config ? config[channel] : null;
      } else {
        return null;
      }
    } else {
      return channel === 'audio' ? this.audioRemoteEnabled : this.videoRemoteEnabled;
    }
  };

  /**
   * Checks if a given local track is enabled.
   *
   * Take into account the term 'track' refers to the local tracks of the
   * stream as rendered by the browser, not to the webRTC communication
   * channels. For example, disabling a local audio track will cause the
   * browser to stop reproducing the sound, but will not cause the browser
   * to stop receiving it through the corresponding channel.
   *
   * @param {string} type - "audio" or "video"
   * @returns {boolean}
   */
  isTrackEnabled(type: AudioOrVideo): boolean {
    const track: MediaStreamTrack | null = this.getTrack(type);
    return track !== null && track.enabled;
  };

  /*
   * Enables or disables the given track.
   *
   * See isTrackEnabled for more information about tracks vs channels.
   *
   * @param {string} type - "audio" or "video"
   * @param {boolean} enabled
   */
  setEnabledTrack(type: AudioOrVideo, enabled: boolean): void {
    var track: MediaStreamTrack | null = this.getTrack(type);
    if (track !== null) {
      track.enabled = enabled;
    }
  };

  /*
   * Checks whether the feed has a given track.
   *
   * See isTrackEnabled for more information about tracks vs channels.
   *
   * @param {string} type - "audio" or "video"
   */
  hasTrack(type: AudioOrVideo): boolean {
    return this.getTrack(type) !== null;
  };

  /**
   * Sets picture for picture channel
   * @param {string} val - path to picture
   */
  setPicture(val: string) {
    this.picture = val;
  };

  /**
   * Gets picture for picture channel
   * @return {string} path to picture
   */
  getPicture(): string | null {
    return this.picture;
  };

  /**
   * Sets janus stream for the feed
   *
   * @param {MediaStream} val - janus stream
   */
  setStream(val: MediaStream) {
    if (this.publisher && !this.localScreen) {
      this.speakObserver = createSpeakObserver(val, {
        start: () => {
          this.updateLocalSpeaking(true);
        },
        stop: () => {
          this.updateLocalSpeaking(false);
        }
      });
      this.speakObserver.start();
    }

    this.stream = val;
  };

  /**
   * Adds a track to the stream
   *
   * @note A new stream is created if it does not exist.
   * @param {MediaStreamTrack} track - media track
   */
  addTrack(track: MediaStreamTrack) {
    if (!this.stream) {
      this.stream = new MediaStream();
    }
    this.stream.addTrack(track.clone());
  }

  /**
   * Gets janus stream for the feed
   * @return {object} janus stream
   */
  getStream(): MediaStream | null {
    return this.stream;
  };

  /**
   * Sets speaking flag
   * @param {boolean} val - true if feed speaking
   */
  setSpeaking(val: boolean) {
    this.speaking = val;
  };

  /**
   * Gets feed speaking flag
   * @return {boolean} true if feed speaking
   */
  getSpeaking(): boolean {
    return this.speaking;
  };

  /**
   * Sets if audio is enabled for that feed. Works only for remote ones.
   *
   * See setStatus
   */
  setAudioEnabled(val: boolean) {
    this.audioRemoteEnabled = val;
  };

  /**
   * Gets if audio is enabled for that feed
   */
  getAudioEnabled(): boolean | null {
    return this.isEnabled('audio');
  };

  /**
   * Sets if video is enabled for that feed. Works only for remote ones.
   *
   * See setStatus
   */
  setVideoEnabled(val: boolean) {
    this.videoRemoteEnabled = val;
  };

  /**
   * Gets if video is enabled for that feed
   */
  getVideoEnabled(): boolean | null {
    return this.isEnabled('video');
  };

  /**
   * Checks if audio is being currently detected in the local feed
   *
   * @returns {Boolean}
   */
  isVoiceDetected(): boolean {
    return this.speakObserver?.isSpeaking();
  };

  /**
   * Checks if data channel is open
   * @returns {boolean}
   */
  isDataOpen(): boolean {
    if (this.connection) {
      return this.connection.isDataOpen;
    } else {
      return false;
    }
  };

  /**
   * Checks if the feed is connected to janus.
   *
   * @returns {boolean}
   */
  getConnected(): boolean {
    return this.connection !== null;
  };

  /**
   * Disconnects from janus
   */
  disconnect() {
    if (this.connection) {
      this.connection.destroy();
    }
    if (this.speakObserver) {
      this.speakObserver.destroy();
    }
    this.connection = null;
    this.stream = null;
  };

  /**
   * Starts ignoring the feed
   */
  ignore() {
    this.ignored = true;
    this.disconnect();
  };

  /**
   * Assigns a new connection to the feed, replacing the current one if there is
   * one.
   *
   * @param {FeedConnection} connection - new connection to Janus
   */
  setConnection(connection: any) {
    this.disconnect();
    this.ignored = false;
    this.connection = connection;
  };

  /**
   * Sets the ignoring flag
   *
   * @param {boolean} val - true if the user wants to ignore the feed data
   */
  setIgnored(val: boolean) {
    this.ignored = val;
  };

  /**
   * Checks if the feed is waiting for the connection to janus to be set
   *
   * @returns {boolean}
   */
  waitingForConnection(): boolean {
    return this.ignored === false && !this.connection;
  };

  /*
   * Enables or disables the given channel
   *
   * If the feed is a publisher, it directly configures the connection to
   * Janus. If the feed is a subscriber, it request the configuration change
   * to the remote peer (only for audio, management of remote video is not
   * implemented).
   *
   * @param {string} type - "audio" or "video"
   * @param {boolean} enabled
   * @param {object} options - use the 'after' key to specify a callback
   *        that will be called after configuring the connection.
   */
  setEnabledChannel(
    type: AudioOrVideo, enabled: boolean, options: any = {}
  ) {
    if (this.publisher) {
      let config = { [type]: enabled };
      this.connection.setConfig({
        values: config,
        ok: (_config: any) => {
          if (type === 'audio' && enabled === false) {
            this.speaking = false;
          }
          if (options.after) {
            options.after();
          }

          this.eventsService.roomEvent('updateFeed', { id: this.id, ...config });
          // Send the new status to remote peers
          this.dataChannelService.sendStatus(this, { exclude: 'picture' });
          // send 'channel' event with status (enabled or disabled)
          this.eventsService.auditEvent('channel');
        }
      });
      if (type === 'video') {
        // Disable the local track in addition to the channel, so it's more
        // obvious for the user that we are not sending video anymore
        this.setEnabledTrack('video', enabled);
      }
    } else if (type === 'audio' && enabled === false) {
      this.dataChannelService.sendMuteRequest(this);
    }
  };

  /**
   * Sets the value of the speaking attribute for that publisher feed,
   * honoring the value of audioEnabled and notifying changes to the
   * remote peers if needed.
   */
  private updateLocalSpeaking(val: boolean) {
    this.eventsService.roomEvent('speakDetection', { speaking: val });
    if (this.isEnabled('audio') === false) {
      val = false;
    }
    if (this.speaking !== val) {
      this.speaking = val;
      if (val === false) {
        this.silentSince = Date.now();
      }
      this.eventsService.roomEvent('updateFeed', { id: this.id, speaking: this.speaking });
      this.dataChannelService.sendSpeakingSignal(this);
    }
  }

  /**
   * Sets the value of the picture attribute for that publisher feed,
   * notifying changes to the remote peers.
   */
  updateLocalPic(data: string) {
    window.setTimeout(() => {
      this.picture = data;
      this.dataChannelService.sendStatus(this);
    });
  };

  /**
   * Updates the value of the display attribute for that publisher feed,
   * notifying changes to the remote peers.
   * @fixme is still used?
   */
  updateDisplay(newDisplay: string) {
    this.setDisplay(newDisplay);
    this.eventsService.roomEvent('updateFeed', { id: this.id, name: newDisplay });
    this.dataChannelService.sendStatus(this);
  };

  /**
   * Gets the current display name for publisher
   * @return {string} - current display
   */
  getDisplay(): string {
    return this.display;
  };

  /**
   * Sets the name for publisher
   * @param {string} - val - new display
   */
  setDisplay(val: string) {
    this.display = val;
  };

  getId() {
    return this.id;
  };

  getLocalScreen(): boolean {
    return this.localScreen;
  };

  getIgnored(): boolean {
    return this.ignored;
  };

  getPublisher(): boolean {
    return this.publisher;
  };

  apiObject({ include, exclude } : { include?: string[], exclude?: string[] } = {}) {
    var attrs = include ? include : Object.keys(apiAttrs);

    if (exclude) {
      attrs = attrs.filter(attr => !exclude.includes(attr));
    }

    let obj : { [key in string]: any } = {};
    attrs.forEach(name => {
      const local_attr = this.getLocalAttr(name);
      if (!local_attr) return;

      const fn = 'get' + this.capitalize(local_attr);
      const val = this[fn as keyof Feed]();
      if (val !== undefined && val !== null) {
        obj[name] = val;
      }
    });
    return obj;
  };

  /**
   * Reads the representation of the local feed in order to send it to the
   * remote peers.
   *
   * @param {object} options - use the 'exclude' key to specify a list of
   *        attributes that should not be included (as array of strings)
   * @returns {object} attribute values
   */
  getStatus(options: object = {}) {
    const opt = {...options, include: statusAttrs };
    return this.apiObject(opt);
  }


  /**
   * Update local representation of the feed (used to process information
   * sent by the remote peer)
   */
  setStatus(attrs: any) {
    if (this.speaking === true && attrs.speaking === false) {
      this.silentSince = Date.now();
    }
    Object.keys(attrs).forEach(key => {
      const local_attr = this.getLocalAttr(key);
      if (!local_attr) return;

      const fn = 'set' + this.capitalize(local_attr);
      this[fn as keyof Feed](attrs[key]);
    });
  };

  /**
   * Checks if the feed audio is inactive and, thus, can be hidden or
   * rendered as a stream of pictures instead of a video
   *
   * @returns {boolean}
   */
  isSilent(threshold : number = 6000): boolean {
    return !this.speaking && this.silentSince < Date.now() - threshold;
  };

  /**
   * Enables or disables the video of the connection to Janus
   */
  setVideoSubscription(value: boolean) {
    if (this.connection === null) { return; }
    this.connection.setConfig({ values: { video: value } });
  };

  /**
   * Gets the status of the video flag of the connection to Janus
   *
   * @returns {boolean}
   */
  getVideoSubscription() : boolean | null {
    if (this.connection && this.connection.getConfig()) {
      return this.connection.getConfig().video;
    } else {
      return null;
    }
  };

  getTrack(type: AudioOrVideo): MediaStreamTrack | null {
    if (this.stream === null || this.stream === undefined) {
      return null;
    }

    let tracks;
    if (type === 'audio') {
      tracks = this.stream.getAudioTracks();
    } else {
      tracks = this.stream.getVideoTracks();
    }

    return tracks[0] || null;
  }

  /**
   * Returns the local attribute name that corresponds to the janusApi attribute
   *
   * @param {string} name janusApi attribute name
   * @return {string} method name
   */
  getLocalAttr(name: string): string {
    const attr = apiAttrs[name];
    if (attr === undefined) {
      console.warn("Attribute", name, "is not defined in apiAttrs", apiAttrs);
    }
    return attr;
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
export const createFeedFactory = (dataChannelService: any, eventsService: any) => (attrs: any) => {
  return new Feed({...attrs, dataChannelService, eventsService});
}
