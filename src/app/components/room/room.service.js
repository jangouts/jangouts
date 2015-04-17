(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RoomService', ['$rootScope', 'Feed', 'DataChannelService', RoomService]);

  function RoomService($rootScope, Feed, DataChannelService) {
    this.enter = enter;
    this.leave = leave;
    if(window.location.protocol === 'http:') {
      this.server = 'http://' + window.location.hostname + ':8088/janus';
    } else {
      this.server = "https://" + window.location.hostname + ":8089/janus";
    }
    window.janus = null;
    window.publisherFeed = new Feed({isPublisher: true});
    this.screenFeed = null;
    this.feeds = {};
    this.roomId = undefined;
    this.publishScreen = publishScreen;
    this.unPublishScreen = unPublishScreen;

    // Enter the room
    function enter(roomId, username) {
      var that = this;
      window.publisherFeed.display = username;
      var $$rootScope = $rootScope;
      Janus.init({
        debug: false,
        callback: function() {
          // Create new session
          window.janus = new Janus({
            server: that.server,
            success: function () {
              window.janus.attach({
                plugin: "janus.plugin.videoroom",
                success: function(pluginHandle) {
                  window.publisherFeed.pluginHandle = pluginHandle;
                  that.roomId = roomId;
                  console.log("Plugin attached! (" + window.publisherFeed.pluginHandle.getPlugin() + ", id=" + window.publisherFeed.pluginHandle.getId() + ")");
                  // Step 1. Right after attaching to the plugin, we send a
                  // request to join
                  var register = { "request": "join", "room": roomId, "ptype": "publisher", "display": username };
                  window.publisherFeed.pluginHandle.send({"message": register});
                  console.log("  -- This is a publisher/manager");
                },
                error: function(error) {
                  console.error("Error attaching plugin... " + error);
                },
                consentDialog: function(on) {
                  console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
                  $$rootScope.$broadcast('consentDialog.changed', on);
                },
                ondataopen: function(data) {
                  console.log("The publisher DataChannel is available");
                },
                onlocalstream: function(stream) {
                  // Step 4b (parallel with 4a).
                  // Send the created stream to the UI, so it can be attached to
                  // some element of the local DOM
                  console.log(" ::: Got a local stream :::");
                  window.publisherFeed.stream = stream;
                  $$rootScope.$broadcast('stream.create', window.publisherFeed);
                },
                oncleanup: function () {
                  console.log(" ::: Got a cleanup notification: we are unpublished now :::");
                },
                onmessage: function (msg, jsep) {
                  var event = msg["videoroom"];
                  console.log("Event: " + event);

                  // Step 2. Response from janus confirming we joined
                  if (event === "joined") {
                    console.log("Successfully joined room " + msg["room"]);
                    window.publisherFeed.id = msg.id;
                    // Step 3. Establish WebRTC connection with the Janus server
                    // Step 4a (parallel with 4b). Publish our feed on server
                    publishOwnFeed(true, window.publisherFeed.pluginHandle);

                    // Step 5. Attach to existing feeds, if any
                    if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
                      var list = msg["publishers"];
                      subscribeToFeeds(list, that.roomId, that.feeds);
                    }
                  // The room has been destroyed
                  } else if(event === "destroyed") {
                    console.log("The room has been destroyed!");
                    $$rootScope.$broadcast('room.destroy');
                  } else if(event === "event") {
                    // Any new feed to attach to?
                    if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
                      var list = msg["publishers"];
                      // FIXME this should not be needed with a proper FeedsService
                      var ignoreId = (that.screenFeed) ? that.screenFeed.id : null;
                      subscribeToFeeds(list, that.roomId, that.feeds, ignoreId);
                    // One of the publishers has gone away?
                    } else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
                      var leaving = msg["leaving"];
                      detachRemoteFeed(leaving, that.feeds);
                    // One of the publishers has unpublished?
                    } else if(msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                      var unpublished = msg["unpublished"];
                      detachRemoteFeed(unpublished, that.feeds);
                    // The server reported an error
                    } else if(msg["error"] !== undefined && msg["error"] !== null) {
                      console.log("Error message from server" + msg["error"]);
                      $$rootScope.$broadcast('room.error', msg["error"]);
                    }
                  }

                  if (jsep !== undefined && jsep !== null) {
                    console.log("Handling SDP as well...");
                    console.log(jsep);
                    window.publisherFeed.pluginHandle.handleRemoteJsep({jsep: jsep});
                  }
                }
              });
            }
          });
        }
      });
    }

    // Negotiates WebRTC by creating a webRTC offer for sharing the audio and
    // (optionally) video with the janus server. On success (the stream is
    // created and accepted), publishes the corresponding feed on the janus
    // server.
    function publishOwnFeed(useVideo, handle) {
      console.log("publishOwnFeed called");
      handle.createOffer({
        media: { // Publishers are sendonly
          videoRecv: false,
          videoSend: useVideo,
          audioRecv: false,
          audioSend: true,
          data: true
        },
        success: function(jsep) {
          console.log("Got publisher SDP!");
          console.log(jsep);
          var publish = { "request": "configure", "audio": true, "video": useVideo };
          handle.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          console.error("WebRTC error:" + error);
          if (useVideo) {
            publishOwnFeed(false, handle);
          } else {
            console.error("WebRTC error... " + JSON.stringify(error));
            console.error(error);
          }
        }
      });
    }

    function publishScreen() {
      var that = this;
      var $$rootScope = $rootScope;
      var feed;
      window.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          feed = new Feed({
            pluginHandle: pluginHandle,
            display: window.publisherFeed.display,
            isPublisher: true
          });
          console.log("Screen sharing plugin attached");
          var register = { "request": "join", "room": that.roomId, "ptype": "publisher", "display": feed.display };
          feed.pluginHandle.send({"message": register});
          that.screenFeed = feed;
        },
        error: function(error) {
          console.error("  -- Error attaching screen plugin... " + error);
        },
        onlocalstream: function(stream) {
          console.log(" ::: Got the screen stream :::");
          that.screenFeed.stream = stream;
          $$rootScope.$broadcast('stream.create', that.screenFeed);
        },
        onmessage: function(msg, jsep) {
          console.log(" ::: Got a message (screen) :::");
          console.log(msg);
          var event = msg.videoroom;

          if (event === "joined") {
            that.screenFeed.id = msg.id;
            publishScreenFeed(that.screenFeed);
          } else {
            console.log("Unexpected event for screen");
          }
          if (jsep !== undefined && jsep !== null) {
            console.log("Handling SDP as well...");
            console.log(jsep);
            that.screenFeed.pluginHandle.handleRemoteJsep({jsep: jsep});
          }
        }
      });
    }

    function unPublishScreen() {
      var $$rootScope = $rootScope;
      if (this.screenFeed) {
        delete this.feeds[this.screenFeed.id];
        this.screenFeed.detach();
        $$rootScope.$broadcast('feeds.delete', this.screenFeed.id);
        this.screenFeed = null;
      }
    }

    function publishScreenFeed(feed) {
      console.log("publishScreenFeed called");
      var handle = feed.pluginHandle;
      handle.createOffer({
        media: {
          videoRecv: false,
          audio: false,
          video: "screen",
          data: false
        },
        success: function(jsep) {
          console.log("Got publisher SDP!");
          console.log(jsep);
          var publish = { "request": "configure", "audio": false, "video": true };
          handle.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          console.error("WebRTC error:" + error);
          console.error(error);
        }
      });
    }

    function subscribeToFeeds(list, room, feeds, ignoreId) {
      console.log("Got a list of available publishers/feeds:");
      console.log(list);
      for(var f in list) {
        var id = list[f]["id"];
        var display = list[f]["display"];
        console.log("  >> [" + id + "] " + display);
        if (id !== ignoreId) {
          createRemoteFeed(id, display, room, feeds)
        }
      }
      // Send status information to inform the newcommers
      // TODO send status about all the feeds that are publisher as soon as the
      // architecture allows it
      window.publisherFeed.sendStatus();
    }

    function detachRemoteFeed(feedId, feeds) {
      console.log("Publisher left: " + feedId);
      var remoteFeed = feeds[feedId];
      if (remoteFeed === undefined) { return };
      console.log("Feed " + remoteFeed.id + " (" + remoteFeed.display + ") has left the room, detaching");
      delete feeds[feedId];
      remoteFeed.detach();
    }

    function createRemoteFeed(id, display, room, feeds) {
      // A new feed has been published, create a new plugin handle and attach to it as a listener
      var remoteFeed = new Feed({id: id, display: display});
      var $$rootScope = $rootScope;
      window.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function(pluginHandle) {
          remoteFeed.pluginHandle = pluginHandle;
          console.log("Plugin attached! (" + remoteFeed.pluginHandle.getPlugin() + ", id=" + remoteFeed.pluginHandle.getId() + ")");
          console.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          var listen = { "request": "join", "room": room, "ptype": "listener", "feed": id };
          remoteFeed.pluginHandle.send({"message": listen});
        },
        error: function(error) {
          console.error("  -- Error attaching plugin... " + error);
        },
        onmessage: function(msg, jsep) {
          console.log(" ::: Got a message (listener) :::");
          console.log(JSON.stringify(msg));
          var event = msg["videoroom"];
          console.log("Event: " + event);
          if(event === "attached") {
            // Subscriber created and attached
            feeds[remoteFeed.id] = remoteFeed;
            $$rootScope.$broadcast('feeds.add', remoteFeed);
            console.log("Successfully attached to feed " + remoteFeed.id + " (" + remoteFeed.display + ") in room " + msg["room"]);
          } else {
            // What has just happened?
          }

          if(jsep !== undefined && jsep !== null) {
            console.log("Handling SDP as well...");
            console.log(jsep);
            // Answer and attach
            remoteFeed.pluginHandle.createAnswer({
              jsep: jsep,
              media: { // We want recvonly audio/video
                audioSend: false,
                videoSend: false,
                data: true
              },
              success: function(jsep) {
                console.log("Got SDP!");
                console.log(jsep);
                var body = { "request": "start", "room": room };
                remoteFeed.pluginHandle.send({"message": body, "jsep": jsep});
              },
              error: function(error) {
                console.error("WebRTC error:" + error);
              }
            });
          }
        },
        onremotestream: function(stream) {
          console.log("Remote feed #" + remoteFeed.id);
          remoteFeed.stream = stream;
          $$rootScope.$broadcast('feeds.update', remoteFeed);
        },
        ondataopen: function(data) {
          console.log("The subscriber DataChannel is available");
        },
        ondata: function(data) {
          console.log(" ::: Got info in the data channel (subscriber) :::");
          DataChannelService.receiveMessage(data, remoteFeed);
        },
        oncleanup: function() {
				  console.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
          $$rootScope.$broadcast('feeds.delete', id);
        }
      });
    }

    function leave() {
      var that = this;
      this.unPublishScreen();
      // Detach all the remote feeds before leaving the room
      for (var i in Object.keys(that.feeds)) {
        detachRemoteFeed(i, that.feeds)
      }
      window.publisherFeed.detach();
    }
  }
}());
