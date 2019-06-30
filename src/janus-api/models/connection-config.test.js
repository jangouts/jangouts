/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createConnectionConfig } from './connection-config.js';

const wantedInit = { audio: true, video: true, data: false };
const jsep = {};

describe('#set', () => {
  const pluginHandle = {
    send: jest.fn()
  };

  test('sends the new configuration', () => {
    let connectionConfig = createConnectionConfig(pluginHandle, wantedInit, jsep, null);
    connectionConfig.offlineConfirm();

    connectionConfig.set({ values: { audio: false, video: false, data: false } });
    expect(pluginHandle.send.mock.calls.length).toBe(2);
    expect(pluginHandle.send.mock.calls[1][0]['message']).toStrictEqual({
      request: 'configure',
      video: false,
      audio: false,
      data: false
    });
  });
});

describe('#confirm', () => {
  test('updates the configuration values', () => {
    const pluginHandle = { send: () => {} };
    let connectionConfig = createConnectionConfig(pluginHandle, wantedInit, jsep, null);

    connectionConfig.offlineConfirm();
    connectionConfig.set({ values: { audio: false, video: false, data: false } });
    return connectionConfig.confirm().then(() => {
      const currentConfig = connectionConfig.get();
      expect(currentConfig).toStrictEqual({ audio: false, video: false, data: false });
    });
  });

  test('executes the okCallback', () => {
    const okCallback = jest.fn();
    const pluginHandle = {
      send: ({ success }) => {
        if (typeof success === 'function') {
          success();
        }
      }
    };

    let connectionConfig = createConnectionConfig(pluginHandle, wantedInit, jsep, null);
    connectionConfig.offlineConfirm();

    connectionConfig.set({ values: { audio: false, video: false, data: false }, ok: okCallback });
    return connectionConfig.confirm().then(() => {
      expect(okCallback.mock.calls.length).toBe(1);
    });
  });
});
