/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RoomService',  RoomService);

    RoomService.$inject = ['$q', '$rootScope', '$timeout', 'FeedsService', 'Room',
      'FeedConnection', 'DataChannelService', 'ActionService', 'jhConfig',
      'ScreenShareService', 'RequestService', 'UserService', 'EventsService'];

  /**
   * Service to communication with janus room
   * @constructor
   * @memberof module:janusHangouts
   */
  function RoomService($q, $rootScope, $timeout, FeedsService, Room,
      FeedConnection, DataChannelService, ActionService, jhConfig,
      ScreenShareService, RequestService, UserService, EventsService) {
    this.enter = enter;
    this.leave = leave;
    this.setRoom = setRoom;
    this.getRoom = getRoom;
    this.getRooms = getRooms;
    this.publishScreen = publishScreen;
    this.unPublishFeed = unPublishFeed;
    this.ignoreFeed = ignoreFeed;
    this.stopIgnoringFeed = stopIgnoringFeed;
    this.addFeeds = addFeeds;
    this.addFeed = addFeed;
    this.subscribeToFeed = subscribeToFeed;
    this.toggleChannel = toggleChannel;
    this.pushToTalk = pushToTalk;
    this.room = null;
    this.rooms = null;
    this.janus = null;

    var that = this;
    var startMuted = false;
    var holdingKey = false;
    var muteTimer = null;

    if (jhConfig.janusServer) {
      this.server = jhConfig.janusServer;
    } else {
      this.server = defaultJanusServer();
    }

    if (jhConfig.janusServerSSL && RequestService.usingSSL()) {
      this.server = jhConfig.janusServerSSL;
    }

    function defaultJanusServer() {
      var wsProtocol;
      var wsPort;

      if (RequestService.usingSSL()) {
        wsProtocol = "wss:";
        wsPort = "8989";
      } else {
        wsProtocol = "ws:";
        wsPort = "8188";
      }

      return [
        wsProtocol + '//' + window.location.hostname + ':' + wsPort + '/janus/',
        window.location.protocol + '//' + window.location.hostname + '/janus/'
      ];
    }

    function connect() {
      var deferred = $q.defer();

      if (that.janus === null) {
        Janus.init({debug: jhConfig.janusDebug});
        that.janus = new Janus({
          server: that.server,
          success: function() {
            deferred.resolve();
          },
          error: function(error) {
            var msg = "Janus error: " + error;
            msg += "\nDo you want to reload in order to retry?";
            deferred.reject();
            if (window.confirm(msg)) {
              window.location.reload();
            }
          },
          destroyed: function() {
            console.log("Janus object destroyed");
          }
        });
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    }

    function doEnter(username) {
      var $$rootScope = $rootScope;
      var connection = null;

      // adding room to EventsService
      EventsService.setRoom(that.room);
       
      // sending user joining event
      EventsService.emitEvent({
        type: "user",
        data: {
          status: "joining"
        }
      });
      
      // send user joining event
      // Create new session
      that.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          // sending 'pluginHandle attached' event
          EventsService.emitEvent({
            type: "pluginHandle",
            data: {
              status: "attached",
              for: "main",
              pluginHandle: pluginHandle
            }
          });
          // Step 1. Right after attaching to the plugin, we send a
          // request to join
          connection = new FeedConnection(pluginHandle, that.room.id, "main");
          connection.register(username, UserService.getPin());
        },
        error: function(error) {
          console.error("Error attaching plugin... " + error);
        },
        consentDialog: function(on) {
          console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
          $$rootScope.$broadcast('consentDialog.changed', on);
          if(!on){
            //notify if joined muted
            if (startMuted) {
              $$rootScope.$broadcast('muted.Join');
            }
          }
        },
        ondataopen: function() {
          console.log("The publisher DataChannel is available");
          connection.onDataOpen();
          sendStatus();
        },
        onlocalstream: function(stream) {
          // Step 4b (parallel with 4a).
          // Send the created stream to the UI, so it can be attached to
          // some element of the local DOM
          console.log(" ::: Got a local stream :::");
          // local stream attached event
          EventsService.emitEvent({
            type: "stream",
            data: {
              stream: "local",
              for: "main",
              peerconnection: connection.pluginHandle.webrtcStuff.pc
            }
          });
          var feed = FeedsService.findMain();
          feed.setStream(stream);
        },
        oncleanup: function () {
          console.log(" ::: Got a cleanup notification: we are unpublished now :::");
        },
        onmessage: function (msg, jsep) {
          var event = msg.videoroom;
          console.log("Event: " + event);

          // Step 2. Response from janus confirming we joined
          if (event === "joined") {
            console.log("Successfully joined room " + msg.room);
            // sending user joined event
            EventsService.emitEvent({
              type: "user",
              data: {
                status: "joined"
              }
            });
            ActionService.enterRoom(msg.id, username, connection);
            // Step 3. Establish WebRTC connection with the Janus server
            // Step 4a (parallel with 4b). Publish our feed on server

            if (isPresent(jhConfig.joinUnmutedLimit)) {
              startMuted = isArray(msg.publishers) && msg.publishers.length >= jhConfig.joinUnmutedLimit;
            }

            connection.publish({
              muted: startMuted,
              error: function() { connection.publish({noCamera: true, muted: startMuted}); }
            });

            // Step 5. Attach to existing feeds, if any
            if (isArray(msg.attendees)) {
              that.addFeeds(msg.attendees, false);
            }
            if (isArray(msg.publishers)) {
              that.addFeeds(msg.publishers, true);
            }
            // The room has been destroyed
          } else if (event === "destroyed") {
            console.log("The room has been destroyed!");
            $$rootScope.$broadcast('room.destroy');
          } else if (event === "event") {
            // Any new feed to attach to?
            if (isArray(msg.publishers)) {
              that.addFeeds(msg.publishers, true);
            }
            // Any new non-publishing attendee?
            if (isPresent(msg.joining)) {
              that.addFeed(msg.joining.id, msg.joining.display, false);
            }
            // One of the publishers has gone away?
            if (isPresent(msg.leaving)) {
              var leaving = msg.leaving;
              ActionService.destroyFeed(leaving);
            }
            // One of the publishers has unpublished?
            if (isPresent(msg.unpublished)) {
              var unpublished = msg.unpublished;
              ActionService.unpublishFeed(unpublished);
            }
            // Reply to a configure request
            if (msg.configured) {
              connection.confirmConfig();
            }
            // The server reported an error
            if (isPresent(msg.error)) {
              console.log("Error message from server" + msg.error);
              $$rootScope.$broadcast('room.error', msg.error);
            }
          }

          if (isPresent(jsep)) {
            connection.handleRemoteJsep(jsep);
          }
        }
      });
    }

    function doGetRooms() {
      var deferred = $q.defer();

      // Create a new session just to get the list
      that.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          console.log("getAvailableRooms plugin attached (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");
          var request = { "request": "list" };
          pluginHandle.send({"message": request, success: function(result) {
            // Free the resource (it looks safe to do it here)
            pluginHandle.detach();
            if (result.videoroom === "success") {
              var rooms = _.map(result.list, function(r) {
                return new Room(r);
              });
              rooms = _.sortBy(rooms, "label");
              deferred.resolve(rooms);
            } else {
              deferred.reject();
            }
          }});
        }
      });
      return deferred.promise;
    }

    // Enter the room
    function enter(username) {
      
      var deferred = $q.defer();

      connect().then(function () {
        doEnter(username);
        deferred.resolve();
      });
      return deferred.promise;
    }

    function leave() {
      ActionService.leaveRoom();
    }

    function setRoom(room) {
      this.room = room;
    }

    function getRoom() {
      return this.room;
    }

    function getRooms() {
      var deferred = $q.defer();

      if (this.rooms === null) {
        connect().then(function () {
          doGetRooms().then(function (rooms) {
            that.rooms = rooms;
            deferred.resolve(rooms);
          });
        });
      } else {
        deferred.resolve(this.rooms);
      }
      return deferred.promise;
    }

    function addFeeds(list, subscribe) {
      if (list.length === 0) { return; }

      console.log("Got a list of available feeds (" + subscribe + "):");
      console.log(list);

      for (var f = 0; f < list.length; f++) {
        var id = list[f].id;
        var display = list[f].display;
        console.log("  >> [" + id + "] " + display);
        this.addFeed(id, display, subscribe);
      }
    }

    function addFeed(id, display, subscribe) {
      var feed = FeedsService.find(id);

      if (subscribe) {
        if (feed === null || feed.waitingForConnection()) {
          this.subscribeToFeed(id, display);
        }
      } else {
        if (feed === null) {
          ActionService.remoteJoin(id, display, null);
        }
      }
    }

    function subscribeToFeed(id, display) {
      var feed = FeedsService.find(id);
      var connection = null;

      if (feed) {
        display = feed.display;
      }
      
      // emit 'subscribe' event
      EventsService.emitEvent({
        type: "subscriber",
        data: {
          status: "subscribing",
          to: display
        }
      });
      
      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          // emit subscriber plugin attached event
          EventsService.emitEvent({
            type: "pluginHandle",
            data: {
              status: "attached",
              for: "subscriber",
              pluginHandle: pluginHandle
            }
          });
          connection = new FeedConnection(pluginHandle, that.room.id, "subscriber");
          connection.listen(id, UserService.getPin());
        },
        error: function(error) {
          console.error("  -- Error attaching plugin... " + error);
        },
        onmessage: function(msg, jsep) {
          console.log(" ::: Got a message (subscriber) :::");
          console.log(JSON.stringify(msg));
          var event = msg.videoroom;
          console.log("Event: " + event);
          if (event === "attached") {
            // Subscriber created and attached
            // emit 'subscriber attached' event
            EventsService.emitEvent({
              type: "subscriber",
              data: {
                status: "susbscribed",
                to: display
              }
            });
            $timeout(function() {
              if (feed) {
                ActionService.connectToFeed(id, connection);
              } else {
                ActionService.remoteJoin(id, display, connection);
              }
              console.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg.room);
            });
          } else if (msg.configured) {
            connection.confirmConfig();
          } else if (msg.started) {
            // Initial setConfig, needed to complete all the initializations
            connection.setConfig({values: {audio: true, data: true, video: jhConfig.videoThumbnails}});
          } else if (msg.error_code === 428) {
            console.log("We tried to subscribe to a feed that is not publishing (an attendee)");
            ActionService.stopIgnoringFeed(id);
          } else {
            console.log("What has just happened?!");
          }

          if (isPresent(jsep)) {
            connection.subscribe(jsep);
          }
        },
        onremotestream: function(stream) {
          // emit `remotestream` event
          EventsService.emitEvent({
            type: "stream",
            data: {
              stream: "remote",
              for: "subscriber",
              peerconnection: connection.pluginHandle.webrtcStuff.pc
            }
          });
          FeedsService.waitFor(id).then(function (feed) {
            feed.setStream(stream);
          }, function (reason) {
            console.error(reason);
          });
        },
        ondataopen: function() {
          console.log("The subscriber DataChannel is available");
          connection.onDataOpen();
          // Send status information of all our feeds to inform the newcommer
          sendStatus();
        },
        ondata: function(data) {
          console.log(" ::: Got info in the data channel (subscriber) :::");
          DataChannelService.receiveMessage(data, id);
        },
        oncleanup: function() {
          console.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
        }
      });
    }

    function publishScreen(videoSource) {
      var display = FeedsService.findMain().display;
      var connection;
      var id;
      
      // emit `screenshare` event 
      EventsService.emitEvent({
        type: "screenshare",
        data: {
          status: "starting"
        }
      });
      
      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          // emit screenshare plugin attached event
          EventsService.emitEvent({
            type: "pluginHandle",
            data: {
              status: "attached",
              for: "screen",
              pluginHandle: pluginHandle
            }
          });
          connection = new FeedConnection(pluginHandle, that.room.id, videoSource);
          connection.register(display, UserService.getPin());
          ScreenShareService.setInProgress(true);
        },
        error: function(error) {
          console.error("  -- Error attaching screen plugin... " + error);
        },
        onlocalstream: function(stream) {
          console.log(" ::: Got the screen stream :::");
          var feed = FeedsService.find(id);
          feed.setStream(stream);
          
          // emit 'localstream' event
          EventsService.emitEvent({
            type: "stream",
            data: {
              stream: "local",
              for: "screen",
              peerconnection: connection.pluginHandle.webrtcStuff.pc
            }
          });
            
          // emit 'screenshare started' event 
          EventsService.emitEvent({
            type: "screenshare",
            data: {
              status: "started",
              peerconnection: connection.pluginHandle.webrtcStuff.pc
            }
          });
          
          // Unpublish feed when screen sharing stops
          stream.oninactive = function () {
            // emit 'screenshareStop' event
            EventsService.emitEvent({
              type: "screenshare",
              data: {
                status: "stopped",
                peerconnection: connection.pluginHandle.webrtcStuff.pc
              }
            }); 
            unPublishFeed(id);
            ScreenShareService.setInProgress(false);
          };

        },
        onmessage: function(msg, jsep) {
          console.log(" ::: Got a message (screen) :::");
          console.log(msg);
          var event = msg.videoroom;

          if (event === "joined") {
            id = msg.id;
            ActionService.publishScreen(id, display, connection);

            connection.publish({
              success: function() {
                ScreenShareService.setInProgress(false);
              },
              error: function(error) {
                console.log(error);
                unPublishFeed(id);
                ScreenShareService.setInProgress(false);
                ScreenShareService.showHelp();
              }
            });
          // Reply to a configure request
          } else if (msg.configured) {
            connection.confirmConfig();
          } else {
            console.log("Unexpected event for screen");
          }
          if (isPresent(jsep)) {
            connection.handleRemoteJsep(jsep);
          }
        }
      });
    }

    function unPublishFeed(feedId) {
      ActionService.destroyFeed(feedId);
    }

    function ignoreFeed(feedId) {
      ActionService.ignoreFeed(feedId);
    }

    function stopIgnoringFeed(feedId) {
      this.subscribeToFeed(feedId);
    }

    function toggleChannel(type, feed) {
      ActionService.toggleChannel(type, feed);
    }

    /**
     * Enable audio while holding key and disable audio when the key is released.
     * @param keyevent Keyevent keydown or keyup
     */
    function pushToTalk(keyevent) {
      var disableAudio = function() {
        ActionService.setMedia('audio', false);
        holdingKey = false;
      };
      if (muteTimer) {
        $timeout.cancel(muteTimer);
      }
      // we need this so the user is muted when he focuses another window while holding the key
      muteTimer = $timeout(disableAudio, 1000);


      if (keyevent === 'keydown' && !holdingKey) {
        ActionService.setMedia('audio', true);
        holdingKey = true;
      } else if (keyevent === 'keyup') {
        ActionService.setMedia('audio', false);
        holdingKey = false;
        $timeout.cancel(muteTimer);
      }
    }


    /**
     * Broadcast status information of all our feeds when a data channel is
     * established.
     *
     * To increase the chances of the info to be received, it sends the most
     * important information right away and the whole status some seconds after.
     * Hacky and dirty, we know.
     */
    function sendStatus() {
      FeedsService.publisherFeeds().forEach(function (p) {
        DataChannelService.sendStatus(p, {exclude: "picture"});
        $timeout(function() { DataChannelService.sendStatus(p); }, 4000);
      });
    }

    /**
     * Check whether the given argument has a value.
     */
    function isPresent(value) {
      return (value !== undefined && value !== null);
    }

    /**
     * Check whether the given argument is an array.
     */
    function isArray(value) {
      return (value instanceof Array);
    }
  }
}());
