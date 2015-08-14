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
      'ScreenShareService'];

  function RoomService($q, $rootScope, $timeout, FeedsService, Room,
      FeedConnection, DataChannelService, ActionService, jhConfig, ScreenShareService) {
    this.connect = connect;
    this.enter = enter;
    this.leave = leave;
    this.getAvailableRooms = getAvailableRooms;
    this.setConfig = setConfig;
    this.getRoom = getRoom;
    this.publishScreen = publishScreen;
    this.unPublishFeed = unPublishFeed;
    this.ignoreFeed = ignoreFeed;
    this.stopIgnoringFeed = stopIgnoringFeed;
    this.subscribeToFeeds = subscribeToFeeds;
    this.subscribeToFeed = subscribeToFeed;
    this.toggleChannel = toggleChannel;
    this.publishingFromStart = true;
    this.room = null;
    this.janus = null;

    if (jhConfig.janusServer) {
      this.server = jhConfig.janusServer;
    } else {
      this.server = defaultJanusServer();
    }

    if (jhConfig.janusServerSSL && (window.location.protocol === "https:")) {
      this.server = jhConfig.janusServerSSL;
    }

    function defaultJanusServer() {
      var wsProtocol;
      var wsPort;

      if (window.location.protocol === "https:") {
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

      Janus.init({debug: false});
      this.janus = new Janus({
        server: this.server,
        success: function() {
          deferred.resolve();
        },
        error: function(error) {
          var msg = "Janus error: " + error;
          console.error(msg);
          alert(msg);
          deferred.reject();
        },
        destroyed: function() {
          console.log("Janus object destroyed");
        }
      });

      return deferred.promise;
    }

    // Enter the room
    function enter(username) {
      var that = this;
      var $$rootScope = $rootScope;
      var connection = null;

      // Create new session
      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          // Step 1. Right after attaching to the plugin, we send a
          // request to join
          connection = new FeedConnection(pluginHandle, that.room.id, "main");
          connection.register(username);
        },
        error: function(error) {
          console.error("Error attaching plugin... " + error);
        },
        consentDialog: function(on) {
          console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
          $$rootScope.$broadcast('consentDialog.changed', on);
        },
        ondataopen: function() {
          console.log("The publisher DataChannel is available");
          connection.onDataOpen();
          DataChannelService.sendStatus(FeedsService.findMain());
        },
        onlocalstream: function(stream) {
          // Step 4b (parallel with 4a).
          // Send the created stream to the UI, so it can be attached to
          // some element of the local DOM
          console.log(" ::: Got a local stream :::");
          var feed = FeedsService.findMain();
          $timeout(function () {
            feed.stream = stream;
            observeAudio(feed);
          });
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
            ActionService.enterRoom(msg.id, username, connection);
            // Step 3. Establish WebRTC connection with the Janus server
            // Step 4a (parallel with 4b). Publish our feed on server
            connection.publish({
              noAudioOnStart: !that.publishingFromStart,
              noVideoOnStart: !that.publishingFromStart,
              error: function() {
                connection.publish({
                  noAudioOnStart: !that.publishingFromStart,
                  noVideoOnStart: !that.publishingFromStart,
                  noCamera: true
                });
              }
            });

            // Step 5. Attach to existing feeds, if any
            if ((msg.publishers instanceof Array) && msg.publishers.length > 0) {
              that.subscribeToFeeds(msg.publishers, that.room.id);
            }
            // The room has been destroyed
          } else if(event === "destroyed") {
            console.log("The room has been destroyed!");
            $$rootScope.$broadcast('room.destroy');
          } else if(event === "event") {
            // Any new feed to attach to?
            if ((msg.publishers instanceof Array) && msg.publishers.length > 0) {
              that.subscribeToFeeds(msg.publishers, that.room.id);
              // One of the publishers has gone away?
            } else if(msg.leaving !== undefined && msg.leaving !== null) {
              var leaving = msg.leaving;
              ActionService.destroyFeed(leaving);
              // One of the publishers has unpublished?
            } else if(msg.unpublished !== undefined && msg.unpublished !== null) {
              var unpublished = msg.unpublished;
              ActionService.destroyFeed(unpublished);
              // The server reported an error
            } else if(msg.error !== undefined && msg.error !== null) {
              console.log("Error message from server" + msg.error);
              $$rootScope.$broadcast('room.error', msg.error);
            }
          }

          if (jsep !== undefined && jsep !== null) {
            connection.handleRemoteJsep(jsep);
          }
        }
      });
    }

    function leave() {
      ActionService.leaveRoom();
    }

    function getAvailableRooms() {
      var deferred = $q.defer();

      // Create a new session just to get the list
      this.janus.attach({
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
              deferred.resolve(rooms);
            } else {
              deferred.reject();
            }
          }});
        }
      });
      return deferred.promise;
    }

    function setConfig(config) {
      config = config || {};
      this.room = config.room;
      this.publishingFromStart = config.publishingFromStart || false;
    }

    function getRoom() {
      return this.room;
    }

    function subscribeToFeeds(list) {
      console.log("Got a list of available publishers/feeds:");
      console.log(list);
      for(var f in list) {
        var id = list[f].id;
        var display = list[f].display;
        console.log("  >> [" + id + "] " + display);
        var feed = FeedsService.find(id);
        if (feed === null || feed.waitingForConnection()) {
          this.subscribeToFeed(id, display);
        }
      }
    }

    function subscribeToFeed(id, display) {
      var that = this;
      var feed = FeedsService.find(id);
      var connection = null;

      if (feed) {
        display = feed.display;
      }

      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          connection = new FeedConnection(pluginHandle, that.room.id, "subscriber");
          connection.listen(id);
        },
        error: function(error) {
          console.error("  -- Error attaching plugin... " + error);
        },
        onmessage: function(msg, jsep) {
          console.log(" ::: Got a message (listener) :::");
          console.log(JSON.stringify(msg));
          var event = msg.videoroom;
          console.log("Event: " + event);
          if(event === "attached") {
            // Subscriber created and attached
            $timeout(function() {
              if (feed) {
                ActionService.stopIgnoringFeed(id, connection);
              } else {
                ActionService.remoteJoin(id, display, connection);
              }
              console.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg.room);
            });
          } else if (!msg.configured) {
            // Ignore the 'configured' events here, they are already processed
            // by ConnectionConfig
            console.log("What has just happened?!");
          }

          if(jsep !== undefined && jsep !== null) {
            connection.subscribe(jsep, {withVideo: jhConfig.videoThumnails});
          }
        },
        onremotestream: function(stream) {
          $timeout(function() {
            var feed = FeedsService.find(id);
            feed.stream = stream;
          });
        },
        ondataopen: function() {
          console.log("The subscriber DataChannel is available");
          connection.onDataOpen();
          // Send status information of all our feeds to inform the newcommer
          FeedsService.publisherFeeds().forEach(function (p) {
            DataChannelService.sendStatus(p);
          });
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

    function publishScreen() {
      var display = FeedsService.findMain().display;
      var that = this;
      var connection;
      var id;

      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          connection = new FeedConnection(pluginHandle, that.room.id, "screen");
          connection.register(display);
          ScreenShareService.setInProgress(true);
        },
        error: function(error) {
          console.error("  -- Error attaching screen plugin... " + error);
        },
        onlocalstream: function(stream) {
          console.log(" ::: Got the screen stream :::");
          var feed = FeedsService.find(id);
          $timeout(function () {
            feed.stream = stream;
          });
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
          } else {
            console.log("Unexpected event for screen");
          }
          if (jsep !== undefined && jsep !== null) {
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

    function observeAudio(feed) {
      var speech = hark(feed.stream);
      speech.on('speaking', function() {
        $timeout(function() {
          feed.updateLocalSpeaking(true);
        });
      });
      speech.on('stopped_speaking', function() {
        feed.updateLocalSpeaking(false);
      });
    }

    function toggleChannel(type, feed) {
      ActionService.toggleChannel(type, feed);
    }
  }
}());
