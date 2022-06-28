# janusApi

This component offers a high level interface to interact with the
[VideoRoom plugin](https://janus.conf.meetecho.com/docs/videoroom.html) 
of Janus Gateway.

Most of the interaction is done in an asynchronous way, so the user of the
component must subscribe to the "room" [RxJS](https://rxjs-dev.firebaseapp.com/)
subject to receive information about events and changes in the room.

These are the events currently emitted through such RxJS subject, including the
names of its arguments.

  * `consentDialog { on }`
  * `createParticipant { id, name, local }`
  * `createFeed { participantId, id, name, screen, ignored, speaking, audio, video, picture }`
  * `updateFeed { id, name, ignored, speaking, audio, video, picture }`
  * `updateStream { feedId, stream }`
  * `createChatMessage { feedId, text }`
  * `speakDetection { speaking }`
  * `muteFeed { id, requesterId, participantsLimit }`
  * `destroyFeed { id }`
  * `destroyParticipant { id }`
  * `destroyRoom { }`
  * `reportError { error }`
