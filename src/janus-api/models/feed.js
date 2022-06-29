/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createSpeakObserver } from './speak-observer';

export const createFeedFactory = (dataChannelService, eventsService) => (attrs) => {
  attrs = attrs || {};
  let that = {
    /** @var {integer} id of feed */
    id: attrs.id || 0,
    /** @var {string} name of user streaming feed */
    display: attrs.display || null,
    /** @var {boolean} flag if feed is publishing one, so one that is send from that pc to others */
    publisher: attrs.isPublisher || false,
    /** @var {boolean} flag if feed is local screen sharing feed */
    localScreen: attrs.isLocalScreen || false,
    /** @var {boolean} flag if feed is ignored */
    ignored: attrs.ignored || false,
    connection: attrs.connection || null
  };

  var picture = null;
  var speaking = false;
  var silentSince = Date.now();
  var stream = null;
  var speakObserver = null; // TODO
  // Note: these two attributes are only updated via setStatus with the information
  // received from the remote peer
  var videoRemoteEnabled = true;
  var audioRemoteEnabled = true;

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Maps janusApi attributes to instance methods
  const apiAttrs = {
    // TODO: local is temporary. It actually belongs to Participant, not to Feed.
    id: 'id', screen: 'localScreen', local: 'publisher', name: 'display', ignored: 'ignored',
    speaking: 'speaking', audio: 'audioEnabled', video: 'videoEnabled', picture: 'picture',
    connected: 'connected'
  };

  const statusAttrs = ['name', 'speaking', 'audio', 'video', 'picture'];

  /**
   * Checks if a given channel is enabled
   *
   * @param {string} channel - "audio" or "video"
   * @returns {?boolean}
   */
  that.isEnabled = function(channel) {
    if (that.publisher) {
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
   *
   * @param {MediaStream} val - janus stream
   */
  that.setStream = function(val) {
    stream = val;
    if (that.publisher && !that.localScreen) {
      that.startObserver();
    }
  };

  /**
   * Adds a track to the stream
   *
   * @note A new stream is created if it does not exist.
   * @param {MediaStreamTrack} track - media track
   */
  that.addTrack = function(track) {
    if (!stream) {
      stream = new MediaStream();
    }

    stream.addTrack(track.clone());

    if (track.kind === "audio") {
      that.startObserver();
    }
  }

  /**
   * Start the observer in the stream
   */
  that.startObserver = function() {
    if (!stream) {
      return;
    }

    speakObserver = createSpeakObserver(stream, {
      start: function() {
        updateLocalSpeaking(true);
      },
      stop: function() {
        updateLocalSpeaking(false);
      }
    });
    speakObserver.start();
  }

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
   *
   * See setStatus
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
   *
   * See setStatus
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
  that.getConnected = function() {
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
    stream = null;
  };

  /**
   * Starts ignoring the feed
   */
  that.ignore = function() {
    that.ignored = true;
    that.disconnect();
  };

  /**
   * Assigns a new connection to the feed, replacing the current one if there is
   * one.
   *
   * @param {FeedConnection} connection - new connection to Janus
   */
  that.setConnection = function(connection) {
    that.disconnect();
    that.ignored = false;
    that.connection = connection;
  };

  /**
   * Sets the ignoring flag
   *
   * @param {boolean} val - true if the user wants to ignore the feed data
   */
  that.setIgnored = function(val) {
    that.ignored = val;
  };

  /**
   * Checks if the feed is waiting for the connection to janus to be set
   *
   * @returns {boolean}
   */
  that.waitingForConnection = function() {
    return that.ignored === false && !that.connection;
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

    if (that.publisher) {
      var config = {};
      config[type] = enabled;
      that.connection.setConfig({
        values: config,
        ok: function(_config) {
          if (type === 'audio' && enabled === false) {
            speaking = false;
          }
          if (options.after) {
            options.after();
          }

          eventsService.roomEvent('updateFeed', { id: that.id, ...config });
          // Send the new status to remote peers
          dataChannelService.sendStatus(that, { exclude: 'picture' });
          // send 'channel' event with status (enabled or disabled)
          eventsService.auditEvent('channel');
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
    eventsService.roomEvent('speakDetection', { speaking: val });
    if (that.isEnabled('audio') === false) {
      val = false;
    }
    if (speaking !== val) {
      speaking = val;
      if (val === false) {
        silentSince = Date.now();
      }
      eventsService.roomEvent('updateFeed', { id: that.id, speaking });
      dataChannelService.sendSpeakingSignal(that);
    }
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
    that.setDisplay(newDisplay);
    eventsService.roomEvent('updateFeed', { id: that.id, name: newDisplay });
    dataChannelService.sendStatus(that);
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

  that.getId = function() {
    return that.id;
  };

  that.getLocalScreen = function() {
    return that.localScreen;
  };

  that.getIgnored = function() {
    return that.ignored;
  };

  that.getPublisher = function() {
    return that.publisher;
  };

  that.apiObject = function(options = {}) {
    var attrs = options.include ? options.include : Object.keys(apiAttrs);

    if (options.exclude) {
      attrs = attrs.filter(attr => { return !options.exclude.includes(attr) });
    }

    var obj = {};
    attrs.forEach(name => {
      const local_attr = getLocalAttr(name);
      if (!local_attr) return;

      const fn = 'get' + capitalize(local_attr);
      const val = that[fn]();
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
  that.getStatus = function(options) {
    const opt = {...options, include: statusAttrs };
    return that.apiObject(opt);
  }


  /**
   * Update local representation of the feed (used to process information
   * sent by the remote peer)
   */
  that.setStatus = function(attrs) {
    if (speaking === true && attrs.speaking === false) {
      silentSince = Date.now();
    }
    Object.keys(attrs).forEach(function(key) {
      const local_attr = getLocalAttr(key);
      if (!local_attr) return;

      const fn = 'set' + capitalize(local_attr);
      if (fn in that) {
        that[fn](attrs[key]);
      } else {
        console.warn(fn, "is not defined for Feed");
      }
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
    if (that.connection === null) { return; }
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

  /**
   * Returns the local attribute name that corresponds to the janusApi attribute
   *
   * @param {string} name janusApi attribute name
   * @return {string} method name
   */
  function getLocalAttr(name) {
    const attr = apiAttrs[name];
    if (attr === undefined) {
      console.warn("Attribute", name, "is not defined in apiAttrs", apiAttrs);
    }
    return attr;
  }

  return that;
};
