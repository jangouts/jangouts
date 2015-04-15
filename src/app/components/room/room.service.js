(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RoomService', ['$rootScope', RoomService]);

  function RoomService($rootScope) {
    this.enter = enter;
    this.sendData = sendData;
    this.leave = leave;
    this.server = 'http://' + window.location.hostname + ':8088/janus';
    window.janus = null;
    this.localFeed = {
      id: 0,
      display: null,
      pluginHandle: null,
      stream: null
    };
    this.feeds = {};
    this.roomId = undefined;

    // Enter the room
    function enter(roomId, username) {
      var that = this;
      that.localFeed.display = username;
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
                  that.localFeed.pluginHandle = pluginHandle;
                  that.roomId = roomId;
                  console.log("Plugin attached! (" + that.localFeed.pluginHandle.getPlugin() + ", id=" + that.localFeed.pluginHandle.getId() + ")");
                  // Step 1. Right after attaching to the plugin, we send a
                  // request to join
                  var register = { "request": "join", "room": roomId, "ptype": "publisher", "display": username };
                  that.localFeed.pluginHandle.send({"message": register});
                  console.log("  -- This is a publisher/manager");
                },
                error: function(error) {
                  console.error("Error attaching plugin... " + error);
                },
                consentDialog: function(on) {
                  // TODO
                  console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
                },
                ondataopen: function(data) {
                  console.log("The publisher DataChannel is available");
                },
                onlocalstream: function(stream) {
                  // Step 4b (parallel with 4a).
                  // Send the created stream to the UI, so it can be attached to
                  // some element of the local DOM
                  console.log(" ::: Got a local stream :::");
                  that.localFeed.stream = stream;
                  $$rootScope.$broadcast('stream.create', that.localFeed);
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
                    // Step 3. Establish WebRTC connection with the Janus server
                    // Step 4a (parallel with 4b). Publish our feed on server
                    publishOwnFeed(true, that.localFeed.pluginHandle);

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
                      subscribeToFeeds(list, that.roomId, that.feeds);
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
                    that.localFeed.pluginHandle.handleRemoteJsep({jsep: jsep});
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
    function publishOwnFeed(useVideo, handler) {
      console.log("publishOwnFeed called");
      handler.createOffer({
        media: { // Publishers are sendonly
          audioRecv: false,
          videoRecv: false,
          audioSend: true,
          videoSend: useVideo,
          data: true
        },
        success: function(jsep) {
          console.log("Got publisher SDP!");
          console.log(jsep);
          var publish = { "request": "configure", "audio": true, "video": useVideo };
          handler.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          console.error("WebRTC error:" + error);
          if (useVideo) {
            publishOwnFeed(false, handler);
          } else {
					  console.error("WebRTC error... " + JSON.stringify(error));
          }
        }
      });
    }

    function subscribeToFeeds(list, room, feeds) {
      console.log("Got a list of available publishers/feeds:");
      console.log(list);
      for(var f in list) {
        var id = list[f]["id"];
        var display = list[f]["display"];
        console.log("  >> [" + id + "] " + display);
        createRemoteFeed(id, display, room, feeds)
      }
    }

    function detachRemoteFeed(feedId, feeds) {
      console.log("Publisher left: " + feedId);
      var remoteFeed = feeds[feedId];
      if (remoteFeed === undefined) { return };
      console.log("Feed " + remoteFeed.id + " (" + remoteFeed.display + ") has left the room, detaching");
      delete feeds[feedId];
      remoteFeed.pluginHandle.detach();
    }

    function createRemoteFeed(id, display, room, feeds) {
      // A new feed has been published, create a new plugin handle and attach to it as a listener
      var remoteFeed = { id: id, display: display };
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
          var msg = JSON.parse(data);
          var type = msg["type"];
          var content = msg["content"];
          if (type == "chatMsg") {
            $$rootScope.$broadcast('chat.message', {feed: remoteFeed, content: content});
          } else {
            console.log("Unknown data type: " + type);
          }
        },
        oncleanup: function() {
				  console.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
          $$rootScope.$broadcast('feeds.delete', id);
        }
      });
    }

    function sendData(type, content) {
      var that = this;
      var text = JSON.stringify({
        type: type,
        content: content
      });
      var handle = that.localFeed.pluginHandle;
      handle.data({
        text: text,
        error: function(reason) { alert(reason); },
        success: function() { console.log("Data sent: " + type); }
      });
    }

    function leave() {
      var that = this;
      // Detach all the remote feeds before leaving the room
      for (var i in Object.keys(that.feeds)) {
        detachRemoteFeed(i, that.feeds)
      }
      that.localFeed.pluginHandle.detach();
      that.localFeed.pluginHandle = null;
    }
  }
}());
