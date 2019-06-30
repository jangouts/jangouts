/**
 * Copyright (c) [2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createFeedConnection } from './feed-connection';

const emitEvent = jest.fn();
const eventsService = () => ({ emitEvent: emitEvent });
const pluginHandle = {
  getId: () => 1,
  getPlugin: () => 'videoroom',
  detach: jest.fn(),
  send: jest.fn(),
  handleRemoteJsep: jest.fn(),
  data: jest.fn(),
  createOffer: jest.fn()
};
const roomId = 2;
const role = 'subscriber';

const createFeedConnectionFactory = createFeedConnection(eventsService());

describe('#destroy', () => {
  test('detaches the handle and emits an event', () => {
    const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, role);

    feedConnection.destroy();
    expect(emitEvent).toHaveBeenCalledWith({
      type: 'pluginHandle',
      data: {
        for: role,
        pluginHandle: pluginHandle,
        status: 'detached'
      }
    });
    expect(pluginHandle.detach.mock.calls.length).toBe(1);
  });
});

describe('#register', () => {
  test('sends a "join" request for the given room', () => {
    const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, role);
    feedConnection.register('me', '1234');
    expect(pluginHandle.send).toHaveBeenCalledWith({
      message: {
        display: 'me',
        pin: '1234',
        ptype: 'publisher',
        request: 'join',
        room: roomId
      }
    });
  });
});

describe('#listen', () => {
  test('sends a "join" request for the given room and feed', () => {
    const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, role);
    feedConnection.listen(1, '1234');
    expect(pluginHandle.send).toHaveBeenCalledWith({
      message: {
        feed: 1,
        pin: '1234',
        ptype: 'listener',
        request: 'join',
        room: roomId
      }
    });
  });
});

describe('#handleRemoteJsep', () => {
  test('handles the jsep through the plugin handler', () => {
    const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, role);
    const jsep = {};
    feedConnection.handleRemoteJsep(jsep);
    expect(pluginHandle.handleRemoteJsep).toHaveBeenCalledWith({ jsep: jsep });
  });
});

describe('#sendData', () => {
  test('sends the given data through the plugin handler', () => {
    const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, role);
    const data = { text: '1234 ' };
    feedConnection.sendData(data);
    expect(pluginHandle.data).toHaveBeenCalledWith(data);
  });
});

describe('#publish', () => {
  describe('when the main feed is being published', () => {
    test('but with no video', () => {
      const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, 'main');
      feedConnection.publish({ noCamera: true });
      expect(pluginHandle.createOffer).toHaveBeenCalledWith(
        expect.objectContaining({
          media: expect.objectContaining({ videoSend: false })
        })
      );
    });

    test('with video', () => {
      const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, 'main');
      feedConnection.publish({ noCamera: false });
      expect(pluginHandle.createOffer).toHaveBeenCalledWith(
        expect.objectContaining({
          media: expect.objectContaining({ videoSend: true })
        })
      );
    });
  });

  describe('when the screen sharing feed is being published', () => {
    test('with video and audio', () => {
      const feedConnection = createFeedConnectionFactory(pluginHandle, roomId, 'share');
      feedConnection.publish();
      expect(pluginHandle.createOffer).toHaveBeenCalledWith(
        expect.objectContaining({
          media: expect.objectContaining({ video: 'share', data: false, audioSend: false })
        })
      );
    });
  });

  // TODO: check calls to createConnectionConfig factory.
});

xdescribe('#subscribe');

describe('#setConfig', () => {
  describe('when no configuration options are set', () => {
    test.todo('sets given options');
  });
  describe('when some options were already set', () => {
    test.todo('merges old and new options');
  });
});
