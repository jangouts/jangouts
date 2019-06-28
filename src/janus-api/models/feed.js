/**
 * Copyright (c) [2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createSpeakObserver } from './speak-observer';

export const createFeedFactory = (
  dataChannelService,
  eventsService
) => attrs => {
  attrs = attrs || {};
  let that = {
    /** @var {integer} id of feed */
    id: attrs.id || 0,
    /** @var {string} name of user streaming feed */
    display: attrs.display || null,
    /** @var {boolean} flag if feed is publishing one, so one that is send from that pc to others */
    isPublisher: attrs.isPublisher || false,
    /** @var {boolean} flag if feed is local screen sharing feed */
    isLocalScreen: attrs.isLocalScreen || false,
    /** @var {boolean} flag if feed is ignored */
    isIgnored: attrs.ignored || false,
    connection: attrs.connection || null
  };

  var picture = null;
  var speaking = false;
  var silentSince = Date.now();
  var videoRemoteEnabled = true;
  var audioRemoteEnabled = true;
  var stream = null;
  var speakObserver = null; // TODO

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Checks if a given channel is enabled
   *
   * @param {string} channel - "audio" or "video"
   * @returns {boolean,null}
   */
  that.isEnabled = function(channel) {
    if (that.isPublisher) {
      if (that.connection && that.connection.getConfig()) {
        return that.connection.getConfig()[channel];
      } else {
        return null;
      }
    } else {
      return channel === 'audio' ? audioRemoteEnabled : videoRemoteEnabled;
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
  that.isTrackEnabled = function(type) {
    var track = getTrack(type);
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
  that.setEnabledTrack = function(type, enabled) {
    var track = getTrack(type);
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
  that.hasTrack = function(type) {
    return getTrack(type) !== null;
  };

  /**
   * Sets picture for picture channel
   * @param {string} val - path to picture
   */
  that.setPicture = function(val) {
    picture = val;
  };

  /**
   * Gets picture for picture channel
   * @return {string} path to picture
   */
  that.getPicture = function() {
    return picture;
  };

  /**
   * Sets janus stream for the feed
   * @param {object} val - janus stream
   */
  that.setStream = function(val) {
    if (that.isPublisher && !that.isLocalScreen) {
      speakObserver = createSpeakObserver(val, {
        start: function() {
          updateLocalSpeaking(true);
        },
        stop: function() {
          updateLocalSpeaking(false);
        }
      });
      speakObserver.start();
    }

    stream = val;
  };

  /**
   * Gets janus stream for the feed
   * @return {object} janus stream
   */
  that.getStream = function() {
    return stream;
  };

  /**
   * Sets speaking flag
   * @param {boolean} val - true if feed speaking
   */
  that.setSpeaking = function(val) {
    speaking = val;
  };

  /**
   * Gets feed speaking flag
   * @return {boolean} true if feed speaking
   */
  that.getSpeaking = function() {
    return speaking;
  };

  /**
   * Sets if audio is enabled for that feed. Works only for remote ones.
   */
  that.setAudioEnabled = function(val) {
    audioRemoteEnabled = val;
  };

  /**
   * Gets if audio is enabled for that feed
   */
  that.getAudioEnabled = function() {
    return that.isEnabled('audio');
  };

  /**
   * Sets if video is enabled for that feed. Works only for remote ones.
   */
  that.setVideoEnabled = function(val) {
    videoRemoteEnabled = val;
  };

  /**
   * Gets if video is enabled for that feed
   */
  that.getVideoEnabled = function() {
    return that.isEnabled('video');
  };

  /**
   * Checks if audio is being currently detected in the local feed
   *
   * @returns {Boolean}
   */
  that.isVoiceDetected = function() {
    return speakObserver && speakObserver.isSpeaking();
  };

  /**
   * Checks if data channel is open
   * @returns {boolean}
   */
  that.isDataOpen = function() {
    if (that.connection) {
      return that.connection.isDataOpen;
    } else {
      return false;
    }
  };

  /**
   * Checks if the feed is connected to janus.
   *
   * @returns {boolean}
   */
  that.isConnected = function() {
    return that.connection !== null;
  };

  /**
   * Disconnects from janus
   */
  that.disconnect = function() {
    if (that.connection) {
      that.connection.destroy();
    }
    if (speakObserver) {
      speakObserver.destroy();
    }
    that.connection = null;
  };

  /**
   * Starts ignoring the feed
   */
  that.ignore = function() {
    that.isIgnored = true;
    that.disconnect();
  };

  /**
   * Stops ignoring the feed
   *
   * @param {FeedConnection} connection - new connection to Janus
   */
  that.stopIgnoring = function(connection) {
    that.isIgnored = false;
    that.connection = connection;
  };

  /**
   * Checks if the feed is waiting for the connection to janus to be set
   *
   * @returns {boolean}
   */
  that.waitingForConnection = function() {
    return that.isIgnored === false && !that.connection;
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
  that.setEnabledChannel = function(type, enabled, options) {
    options = options || {};

    if (that.isPublisher) {
      var config = {};
      config[type] = enabled;
      that.connection.setConfig({
        values: config,
        ok: function() {
          if (type === 'audio' && enabled === false) {
            speaking = false;
          }
          if (options.after) {
            options.after();
          }
          // Send the new status to remote peers
          dataChannelService.sendStatus(that, { exclude: 'picture' });

          // send 'channel' event with status (enabled or disabled)
          eventsService.emitEvent({
            type: 'channel',
            data: {
              channel: type,
              status: enabled,
              peerconnection: that.connection.pluginHandle.webrtcStuff.pc
            }
          });
        }
      });
      if (type === 'video') {
        // Disable the local track in addition to the channel, so it's more
        // obvious for the user that we are not sending video anymore
        that.setEnabledTrack('video', enabled);
      }
    } else if (type === 'audio' && enabled === false) {
      dataChannelService.sendMuteRequest(that);
    }
  };

  /**
   * Sets the value of the speaking attribute for that publisher feed,
   * honoring the value of audioEnabled and notifying changes to the
   * remote peers if needed.
   */
  function updateLocalSpeaking(val) {
    // TODO: is setTimeout needed?
    window.setTimeout(function() {
      if (that.isEnabled('audio') === false) {
        val = false;
      }
      if (speaking !== val) {
        speaking = val;
        if (val === false) {
          silentSince = Date.now();
        }
        dataChannelService.sendStatus(that, { exclude: 'picture' });
      }
    });
  }

  /**
   * Sets the value of the picture attribute for that publisher feed,
   * notifying changes to the remote peers.
   */
  that.updateLocalPic = function(data) {
    window.setTimeout(function() {
      picture = data;
      dataChannelService.sendStatus(that);
    });
  };

  /**
   * Updates the value of the display attribute for that publisher feed,
   * notifying changes to the remote peers.
   */
  that.updateDisplay = function(newDisplay) {
    // TODO: is setTimeout needed?
    window.setTimeout(function() {
      that.setDisplay(newDisplay);
      dataChannelService.sendStatus(that);
    });
  };

  /**
   * Gets the current display name for publisher
   * @return {string} - current display
   */
  that.getDisplay = function() {
    return that.display;
  };

  /**
   * Sets the name for publisher
   * @param {string} - val - new display
   */
  that.setDisplay = function(val) {
    that.display = val;
  };
  /**
   * Reads the representation of the local feed in order to send it to the
   * remote peers.
   *
   * @param {object} options - use the 'exclude' key to specify a list of
   *        attributes that should not be included (as array of strings)
   * @returns {object} attribute values
   */
  that.getStatus = function(options) {
    options = options || {};
    if (!options.exclude) {
      options.exclude = [];
    }

    var attrs = [
      'audioEnabled',
      'videoEnabled',
      'speaking',
      'picture',
      'display'
    ];
    var status = {};

    attrs.forEach(function(attr) {
      if (!options.exclude.includes(attr)) {
        status[attr] = that['get' + capitalize(attr)]();
      }
    });
    return status;
  };

  /**
   * Update local representation of the feed (used to process information
   * sent by the remote peer)
   */
  that.setStatus = function(attrs) {
    console.log('setStatus', attrs);
    // TODO: is setTimeout needed?
    window.setTimeout(function() {
      if (speaking === true && attrs.speaking === false) {
        silentSince = Date.now();
      }
      Object.keys(attrs).forEach(function(key) {
        that['set' + capitalize(key)](attrs[key]);
      });
    });
  };

  /**
   * Checks if the feed audio is inactive and, thus, can be hidden or
   * rendered as a stream of pictures instead of a video
   *
   * @returns {boolean}
   */
  that.isSilent = function(threshold) {
    if (!threshold) {
      threshold = 6000;
    }
    return !speaking && silentSince < Date.now() - threshold;
  };

  /**
   * Enables or disables the video of the connection to Janus
   */
  that.setVideoSubscription = function(value) {
    that.connection.setConfig({ values: { video: value } });
  };

  /**
   * Gets the status of the video flag of the connection to Janus
   *
   * @returns {boolean}
   */
  that.getVideoSubscription = function() {
    if (that.connection && that.connection.getConfig()) {
      return that.connection.getConfig().video;
    } else {
      return null;
    }
  };

  function getTrack(type) {
    if (stream === null || stream === undefined) {
      return null;
    }
    var func = 'get' + capitalize(type) + 'Tracks';
    if (stream[func]() === null || stream[func]() === undefined) {
      return null;
    }
    var track = stream[func]()[0];
    if (track === undefined) {
      return null;
    }
    return track;
  }

  return that;
};
