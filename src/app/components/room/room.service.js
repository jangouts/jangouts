(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RoomService', ['$rootScope', RoomService]);

  function RoomService($rootScope) {
    this.enter = enter;
    this.server = 'http://' + window.location.hostname + ':8088/janus';
    window.janus = null;
    this.mcutest = undefined;
    this.userId = undefined;
    this.localStream = undefined;

    function enter(roomId, username) {
      var that = this;
      var $$rootScope = $rootScope;
      Janus.init({
        debug: true,
        callback: function() {
          // Create new session
          that.janus = new Janus({
            server: that.server,
            success: function () {
              that.janus.attach({
                plugin: "janus.plugin.videoroom",
                success: function(pluginHandle) {
                  that.mcutest = pluginHandle;
                  console.log("Plugin attached! (" + that.mcutest.getPlugin() + ", id=" + that.mcutest.getId() + ")");
                  var register = { "request": "join", "room": roomId, "ptype": "publisher", "display": username };
                  that.mcutest.send({"message": register});
                  console.log("  -- This is a publisher/manager");
                },
                error: function(error) {
                  console.error("Error attaching plugin... " + error);
                },
                onlocalstream: function(stream) {
                  console.log(" ::: Got a local stream :::");
                  that.localStream = stream;
                  $$rootScope.$broadcast('stream.create', stream);
                  console.log(stream);
                },
                onmessage: function (msg, jsep) {
                  var event = msg["videoroom"];
                  console.log("Event: " + event);

                  if (event === "joined") {
                    // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                    that.userId = msg["id"];
                    console.log("Successfully joined room " + msg["room"] + " with ID " + that.userId);
                    publishOwnFeed(true, that.mcutest);
                  }

                  if (jsep !== undefined && jsep !== null) {
                    console.log("Handling SDP as well...");
                    console.log(jsep);
                    that.mcutest.handleRemoteJsep({jsep: jsep});
                  }
                }
              });
            }
          });
        }
      });
    }

    function publishOwnFeed(useVideo, handler) {
      console.log("publishOwnFeed called");
      handler.createOffer({
        media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: useVideo },	// Publishers are sendonly
        success: function(jsep) {
          console.log("Got publisher SDP!");
          console.log(jsep);
          var publish = { "request": "configure", "audio": true, "video": useVideo };
          handler.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          console.log("WebRTC error:");
          console.log(error);
          if (useVideo) {
            publishOwnFeed(false, handler);
          } else {
					  console.error("WebRTC error... " + JSON.stringify(error));
          }
        }
      });
    }

  }
}());
