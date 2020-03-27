/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { fetch } from './config';

const createXhrMock = (responseText, status = 200) => {
  return {
    open: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    status,
    responseText
  };
};

describe('#fetch', () => {
  const oldXMLHttpRequest = window.XMLHttpRequest;
  const oldLocation = window.location;

  afterAll(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
    window.location = oldLocation;
  });

  test('fetches and returns the configuration', (done) => {
    const config = {
      janusServer: 'ws://jangouts.io:8188/janus',
      thumbnailMode: true
    };
    const xhrMock = createXhrMock(JSON.stringify(config));
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    const configPromise = fetch();
    xhrMock.onload();
    configPromise.then((config) => {
      expect(config.janusServer).toBe('ws://jangouts.io:8188/janus');
      expect(config.thumbnailMode).toBe(true);
      done();
    });
  });

  test('returns the default configuration if not found', (done) => {
    const xhrMock = createXhrMock('', 404);
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    const configPromise = fetch();
    xhrMock.onload();
    configPromise.then((config) => {
      expect(config.janusServer).toBe('ws://localhost:8188/janus');
      expect(config.thumbnailMode).toBe(false);
      done();
    });
  });

  test('returns the default configuration if no valid JSON is found', (done) => {
    const xhrMock = createXhrMock('this is not JSON', 200);
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    const configPromise = fetch();
    xhrMock.onload();
    configPromise.then((config) => {
      expect(config.janusServer).toBe('ws://localhost:8188/janus');
      expect(config.thumbnailMode).toBe(false);
      done();
    });
  });

  test('includes the ws: janusServer if none is given and current proto is http', (done) => {
    delete window.location;
    window.location = { protocol: 'http:', hostname: 'example.net' };
    const xhrMock = createXhrMock(JSON.stringify({ janusServer: null }));
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    const configPromise = fetch();
    xhrMock.onload();
    configPromise.then((config) => {
      expect(config.janusServer).toBe('ws://example.net:8188/janus');
      done();
    });
  });

  test('includes the wss: janusServer if none is given and the current proto is https', (done) => {
    delete window.location;
    window.location = { protocol: 'https:', hostname: 'example.net' };
    const xhrMock = createXhrMock(JSON.stringify({ janusServer: null }));
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    const configPromise = fetch();
    xhrMock.onload();
    configPromise.then((config) => {
      expect(config.janusServer).toBe('wss://example.net:8189/janus');
      done();
    });
  });
});
