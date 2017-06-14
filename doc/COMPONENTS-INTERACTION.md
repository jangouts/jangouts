# Jangouts - Working Details


## How Janus makes it possible?

![Janus connections](janus.png?raw=true "Janus connections")

Suppose there are `n` participants in a videoroom
* All the participants are connected to Janus instance running on the server
* For each participant, a session is created (i.e. `n` sessions here for `n` clients).
* Each session has a set of `n` different handles for `n` participants. All sets are different.
* Each participant keeps `n` peer connections to Janus (instead of having peer connections directly to the other participant's browser/client). Out of n peer connections, participant uses 1 peer connection for sending it's own content, and, other n-1 peer connections for consuming other n-1 participants' content. 
* Then, Janus forwards the content between these connections.

*Jangouts* exploits this feature of *Janus* to connect clients and provides an interactive UI to make communication possible among them.


## Some important Components in Jangouts (Brief details)

01. [room.service.js](../src/app/components/room/room.service.js) - It is a service that provides methods to communicate with janus room. It performs following tasks -
  * Connects with the Janus instance
  * Fetches available rooms list
  * Creates a new `Room` object for each room in fetched rooms list
  * Creates a new `FeedConnection` object right after attaching to the plugin (`janus.plugin.videoroom`) (for entering a room)
  * Subscribe to -
    + existing feeds on `"joined"` event
    + new feeds on `"event"` event
  * Calls `ActionService` methods to 
    + Enter/Leave a room
    + Publish/Unpublish a feed/screen
    + Start/Stop ignoring a feed
    + Toggle a channel
    + Remote join
    + Disable/Enable audio/video for main feed
  * Calls `FeedsService`methods to
    + find `Feed` object using id
    + find `"main" Feed` object
  * Calls `DataChannelService` methods to
    + Broadcast status information of all feeds when a data channel is established
    + Recieve messages from a feed

02. [room.factory.js](../src/app/components/room/room.factory.js) - It defines `Room` object containing data about video chat room and attributes from *janus.plugin.videoroom.cfg*. Some of its attributes are -
  * id
  * description
  * max-publishers
  * pin-required
 etc.

03. [feed-connection.factory.js](../src/app/components/feed/feed-connection.factory.js) - It defines `FeedConnection` object that manages the connection of a feed to the Janus server. Some of the attributes provided are - 
  * `pluginHandle` object
  * feed role (publisher/subscriber)
  * `ConnectionConfig` object (using *connection-config.factory.js*)
It also performs some important actions like - 
  * sending a `join` request (`register()` and `listen()` methods)
  * negotiating a WebRTC connection by -
    + creating a WebRTC `offer` for sharing the audio and video with the Janus server (`publish()` method)
    + creating a WebRTC `answer` for subscribing to a feed from the Janus server (`subscribe()` method)

04. [action.service.js](../src/app/components/room/action.service.js) - Provides services by performing actions, like - 
  * Creating new feed when
    + entering a room
    + publishing screen
    + remote join
  * Destroying feed when
    + leaving a room
    + unpublishing screen
  * Disabling or enabling audio or video for the main feed
  * Ignoring or stop ignoring a feed
  * Toggling channel (muting or unmuting)
  * Adding log entries for above actions (by creating `LogEntry` object defined in *log-entries.factory.js*)
  * Sending chat text-message using `DataChannelService` (defined in *data-channel.service.js*) 

05. [feeds.factory.js](../src/app/components/feed/feeds.factory.js) - Defines `Feed` object representing a Janus feed. It maintains data related to a feed for local representation, and, sending to remote peers. It contains attributes like -
  * `FeedConnection` object
  * `id` and `display` of feed
  * other feed info -`isPublisher`, `isLocalScreen`, `isIgnored`
 It also contains methods that perform actions like - 
  * changing the display
  * start/stop ignoring a feed
  * enabling/disabling a channel/track
  * Reads local feed info, to send it to the remote peers (`getStatus()` method)
  * Update local feed info used to process information sent by the remote peer (`setStatus()` method)

06. [feeds.service.js](../src/app/components/feed/feeds.service.js) - It maintains a `feeds` object that contains all the `Feed` objects. A `feeds` object has feed id as key and corresponding `Feed` object as value.

07. [log.service.js](../src/app/components/room/log.service.js) - It maintains an array of all the `LogEntry` objects created. It supplies all these log entries, for rendering, to `jh-video-chat.html` via `jh-video-chat.directive.js`.

08. [log-entries.factory.js](../src/app/components/room/log-entries.factory.js) - It defines `LogEntry` objects which store following types of log entries -
  * Mute Request
  * Chat Message
  * User joined/left a room
  * Started/Stopped ignoring a feed
  * Started/Stopped sharing screen
 For each log entry, a new LogEntry object is created.

09. [data-channel.service.js](../src/app/components/room/data-channel.service.js) - It deals with data-channel communication. It provides services like -
  * sending and recieving
    + chat messages
    + mute requests
    + status updates

10. [connection-config.factory.js](../src/app/components/feed/connection-config.factory.js) - It defines `ConnectionConfig` object that handles the status of the configuration flags (audio, video and data) of the connection to Janus, keeping them synced between client and server. It handles correctly several consequent changes of the flag values keeping the number of requests to a minimum.


## Interaction among Components


### Initial loading

* *jangouts* starts initializing and loading other modules from [index.js](../src/app/index.js), which defines the main module *janusHangouts* and its dependency on other modules.
* It reads the configuration options from *config.json* provided by the server and sets the value of `config` object, provided by [config.provider.js](../src/app/config.provider.js).
* Then, it directs to `signin` page.


### Fetching rooms list

![Fetching Rooms List](fetch-rooms-list.png?raw=true "Fetching Rooms List")

After redirection to signin page, *jh-signin-form.directive.js* calls `RoomService.getRooms()` to get the rooms list. To fetch the list, (which is then displayed on the signin page), the *room.service.js* performs following steps -
* Janus object is initialized (using `Janus.init()` defined in *janus.js*) after reading the config object provided by *config.provider.js* and a new Janus object is created (using ` new Janus()`). Once created, this object represents a session with the gateway. (See NOTE below this section)
* Then a new handle on this session is created just to fetch the rooms list.
* This is done by using `Janus.attach()` and specifying a plugin (`janus.plugin.videoroom` in our case) to recieve a `pluginHandle` object. This allows *jangouts* to exploit the features of a plugin to manipulate the media sent and/or received by a `PeerConnection`
* We use `pluginHandle` object to send `list` request to Janus server.
* On success, the `result` object is recieved. The rooms list is accessed as `result.list`, which is an Array of `room` objects.
* These `room` objects are converted to `Room` objects (*room.factory.js*) for further use.
* Then `pluginHandle.detach()` destroys the handle.

NOTE: See Janus [JavaScript API](https://janus.conf.meetecho.com/docs/JS.html) for more details on Janus library.


### Entering a room

![Enter room](enter-room.png?raw=true "Enter room")

When a participant wants to enter a room, process starts same as fetching rooms list. A new `handle` is created on same `session` (same session used in fetching rooms list). After recieving `pluginHandle` object, *room.service.js* performs following steps -
 * A new `FeedConnection` object is created with `pluginHandle` object.
 * Then, it sends a `join` request with `ptype: "publisher"` using `register()` method. On success, it recieves a response object `msg` with `msg.videoroom = "joined"` and a `msg.id` which is unique for each participant in a room.
 * `ActionService.enterRoom()` is called for creating a new corresponding `Feed` object (with `isPublisher: true`), which is then added to `FeedService.feeds` object.
 * Also, `publishing` feed on server is done parallely along with sending local stream to the UI.
 * For `publishing`, a WebRTC offer is created using `pluginHandle.createOffer()`.
 * Then we see a `consent dialog` asking for video/audio access. On recieving the participant's response, according to permissions, the *janus.js* creates `RTCPeerConnection` object and creates a local stream.
 * As a result, it recieves the `localstream` and attaches the stream with the feed.
 * Till now, Janus has created a `Data-Channel` and WebRTC offer is ready. As a result, on success, publisher SDP (`JSEP object`) is recieved.
 * A new `ConnectionConfig` object is created with `pluginHandle`, `cfg` (configuration flags) and `JSEP`. As a result, `configure()` gets called for initial configuration.
 * `configure` message is send to the `plugin`. On success, response object `msg` is recieved with `msg.configured = "ok"`.
 * Finally, response object `msg` (of Step 2) is checked for existing feeds, and, `RoomService.subscribeToFeeds()` function is called for attaching to existing feeds. (For more detail, see next section **Attaching to existing and new feeds**)


### Attaching to existing and new feeds

When a participant enters a room, she/he must be attached to existing feeds representing participants (if any) in the room. As explained in section - **Entering a room**, response object is checked for existing feeds. If they exist, *room.service.js* performs following actions, for each feed in the list -
 * `RoomService.subscribeToFeed()` function is called and a handle is created.
 * `pluginHandle` object is recieved and a new `FeedConnection` object is created.
 * Then, it sends a `join` request with `ptype: "listener"` using `listen()` method. On success, it recieves a response object `msg` with `msg.videoroom = "attached"`, and, an "offer JSEP" representing remote feed offer.
 * `subscribe()` function is called on `FeedConnection` object to create `WebRTC answer` in response to the `offer` of the remote PeerConnection object.
 * `subscribing` feed on server is done parallely along with sending remote stream to the UI.
 * An `RTCPeerConnection` object is created (to recieve the content of this remote feed). On success to `pluginHandle.createOffer()`, a `JSEP` object of `type="answer"` is recieved (representing local feed's "answer" in reponse to remote feed's "offer").
 * In between, it recieves the `remotestream` and attaches the stream with the feed.
 * `start` request is sent to Janus using `pluginHandle.send()`. On success, response object `msg` is recieved with `msg.started = "ok"`.
 * `FeedConnection` object for the feed is initialized with `config` parameters. A new `ConnectionConfig` object is created and `configure()` (see *connection-config.factory.js*) function gets executed.
 * `configure` message is send to the `plugin`. On success, response object `msg` is recieved with `msg.configured = "ok"`.
 * Now subscriber is created and attached. After the local participant enters the room successfully (see section *Entering a room*), `ActionService.remoteJoin()` is called for creating a new corresponding `Feed` object (with `isPublisher: false`), which is then added to `FeedService.feeds` object. 
 
NOTE: When new users join a videoroom, the participants already present, recieve a `msg` object (`onmessage: function(msg, jsep) {}`). The `msg.videoroom = "event"` and `msg.publishers` is an array of all the new feeds (representing newly joined participants). For each publisher, same steps follow as above.


### Leaving a room

![Leave Room](leave-room.png?raw=true "Leave Room")

When a participant clicks on `Sign out` button, she/he gets redirected to `Sign In` page. In between this, the following actions take place -
* *jh-leave-button.directive.js* call `RoomService` to set current room `null`.
* `$state.go(signin)` changes the state to `signin` and user is redirected to `Sign In` page.
* Before the state changes, *index.js* calls `RoomService.leave()` to clean up all the feeds. 
* This, in turn calls `ActionService.leave()`. It traverses all feeds using `FeesService.allFeeds()` and calls `ActionService.destroyFeed()` for each feed.
* `ActionService.destroyFeed()` calls `feed.diconnect()` (where `feed` is a *feeds.factory.js* object) for each feed, which, in turn calls `connection.destroy()` (where `connection` is a *feed-connection.factory.js* object).
* `connection.destroy()` calls `pluginHandle.detach()` that destroys the handle, and, cleanup notification is recieved.

In this way, all the feeds (including `publisher` feed) gets detached and participant successfully leaves a room.
