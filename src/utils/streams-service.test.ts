/**
 * Copyright (c) [2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { StreamsService } from './streams-service';

beforeAll(() => {
  window.MediaStream = jest.fn().mockImplementation(() =>
    ({ addTrack: jest.fn() })
  );
});

describe('#add', () => {
  it('adds the stream with the corresponding id', () => {
    const service = new StreamsService();
    const mediaStream = new MediaStream();
    service.add(1, mediaStream);
    expect(service.get(1)).toBe(mediaStream);
  });
});

describe('#delete', () => {
  it('removes the stream with the corresponding id', () => {
    const service = new StreamsService();
    const mediaStream = new MediaStream();
    service.add(1, mediaStream);
    service.delete(1);
    expect(service.get(1)).toBeNull();
  });
});
