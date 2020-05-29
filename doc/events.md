# Events

This document tries to enumerate the events that are emitted by the eventsService of the `janusApi`
module.

## addFeed

```javascript
eventsService.emitEvent({ type: 'addFeed', data: feed });
```

## removeFeed

```javascript
eventsService.emitEvent({ type: 'removeFeed', data: { feedId: id } });
```

## muted

```javascript
eventsService.emitEvent({
  type: 'muted',
  data: { cause: 'request', source: { id: source.id, display: source.display } }
});
```

```javascript
eventsService.emitEvent({ type: 'muted', data: { cause: 'user' } });
```

```javascript
eventsService.emitEvent({
  type: 'muted',
  data: { cause: 'join', limit: joinUnmutedLimit }
});
```

* *cause*: request, user, join

## statusUpdate

```javascript
eventsService.emitEvent({
  type: 'statusUpdate',
  data: content
});
```

## participantSpeaking

```javascript
eventsService.emitEvent({
  type: 'participantSpeaking',
  data: { feedId, speaking }
});
```

```javascript
 eventsService.emitEvent({ type: 'log', data: entry });
```

## user

```javascript
eventsService.emitEvent({
  type: 'user',
  data: {
    status: 'joining'
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'user',
  data: {
    status: 'joined'
  }
});
```

## pluginHandle

```javascript
eventsService.emitEvent({
  type: 'pluginHandle',
  data: {
    status: 'attached',
    for: 'main',
    pluginHandle: pluginHandle
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'pluginHandle',
  data: {
    status: 'attached',
    for: 'subscriber',
    pluginHandle: pluginHandle
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'screenshare',
  data: {
    status: 'starting'
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'pluginHandle',
  data: {
    status: 'attached',
    for: 'screen',
    pluginHandle: pluginHandle
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'pluginHandle',
  data: {
    status: 'detached',
    for: role,
    pluginHandle: pluginHandle
  }
});
```

## consentDialog

 ```javascript
eventsService.emitEvent({ type: 'consentDialog', data: { on: on } });
 ```
 
## stream

```javascript
eventsService.emitEvent({
  type: 'stream',
  data: {
    stream: 'local',
    for: 'main',
    feedId: feed.id,
    peerconnection: connection.pluginHandle.webrtcStuff.pc // TODO: is peerconnection needed?
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'stream',
  data: {
    stream: 'remote',
    for: 'subscriber',
    feedId: feed.id,
    peerconnection: connection.pluginHandle.webrtcStuff.pc
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'stream',
  data: {
    stream: 'local',
    for: 'screen',
    feedId: feed.id,
    peerconnection: connection.pluginHandle.webrtcStuff.pc
  }
});
```

## room

```javascript
eventsService.emitEvent({
  type: 'room',
  data: { status: 'destroyed' }
});

```

```javascript
eventsService.emitEvent({
  type: 'room',
  data: { status: 'error', error: msg.error }
});
```

## subscriber

```javascript
eventsService.emitEvent({
  type: 'subscriber',
  data: {
    status: 'subscribing',
    to: display
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'subscriber',
  data: {
    status: 'susbscribed',
    to: display
  }
});
```

## screenshare

```javascript
eventsService.emitEvent({
  type: 'screenshare',
  data: {
    status: 'started',
    peerconnection: connection.pluginHandle.webrtcStuff.pc
  }
});
```

```javascript
eventsService.emitEvent({
  type: 'screenshare',
  data: {
    status: 'stopped',
    peerconnection: connection.pluginHandle.webrtcStuff.pc
  }
});
```

## configChanged

```javascript
eventsService.emitEvent({
  type: 'configChanged',
  data: config
});
```

## error

```javascript
eventsService.emitEvent({
  type: 'error',
  data: {
    status: 'createAnswer',
    error: error,
    peerconnection: that.pluginHandle.webrtcStuff.pc
  }
});
```

## channel

```javascript
eventsService.emitEvent({
  type: 'channel',
  data: {
    source: that.id,
    channel: type,
    status: enabled,
    peerconnection: that.connection.pluginHandle.webrtcStuff.pc
  }
});
```
