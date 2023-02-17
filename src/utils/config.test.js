/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { fetchConfig } from './config';

const mockFetch = ({text, ok}) => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      text: () => Promise.resolve(text),
      ok: ok
    });
  });
};

beforeAll(() => {
  console.error = jest.fn();
});

describe('#fetchConfig', () => {
  it('fetches and returns the configuration', async () => {
    mockFetch({
      ok: true,
      text: '{"janusServer": "ws://jangouts.io:8188/janus"}'
    });

    const config = await fetchConfig();
    expect(config.janusServer).toEqual("ws://jangouts.io:8188/janus");
  });

  it('returns the default configuration if not found', async () => {
    mockFetch({ ok: false });

    const config = await fetchConfig();
    expect(config.janusServer).toEqual(
      ["ws://localhost/janus", "ws://localhost:8188/janus"]
    );
  });

  it('returns the default configuration if no valid JSON is found', async () => {
    mockFetch({ ok: true, text: 'not JSON' });

    const config = await fetchConfig();
    expect(config.janusServer).toEqual(
      ["ws://localhost/janus", "ws://localhost:8188/janus"]
    );
  });

  it('includes ws: URLs in janusServer if none is given and current proto is http', async () => {
    mockFetch({ ok: true, text: '{}' });

    delete window.location;
    window.location = { protocol: 'http:', hostname: 'example.net' };

    const config = await fetchConfig();
    expect(config.janusServer).toEqual(
      ["ws://example.net/janus", "ws://example.net:8188/janus"]
    );
  });

  it('includes wss: URLs in janusServer if none is given and the current proto is https', async () => {
    mockFetch({ ok: true, text: '{}' });

    delete window.location;
    window.location = { protocol: 'https:', hostname: 'example.net' };

    const config = await fetchConfig();
    expect(config.janusServer).toEqual(
      ["wss://example.net/janus", "wss://example.net:8989/janus"]
    );
  });
});
