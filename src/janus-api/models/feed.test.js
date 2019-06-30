/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createFeedFactory } from './feed';

const dataChannelService = {};
const eventsService = {};
const connection = {
  getConfig: jest.fn()
};

const createFeed = createFeedFactory(dataChannelService, eventsService);

describe('#isEnabled', () => {
  describe('when is a publisher', () => {
    describe('but the connection is not defined', () => {
      test('returns false', () => {
        const feed = createFeed({ isPublisher: true });
        expect(feed.isEnabled('audio')).toBe(null);
        expect(feed.isEnabled('video')).toBe(null);
      });
    });

    describe('and connection channels are enabled', () => {
      let connection = {
        getConfig: () => ({ audio: true, video: true })
      };

      test('returns true', () => {
        const feed = createFeed({ isPublisher: true, connection });
        expect(feed.isEnabled('audio')).toBe(true);
        expect(feed.isEnabled('video')).toBe(true);
      });
    });

    describe('and connection channels are disabled', () => {
      let connection = {
        getConfig: () => ({ audio: false, video: false })
      };

      test('returns true', () => {
        const feed = createFeed({ isPublisher: true, connection });
        expect(feed.isEnabled('audio')).toBe(false);
        expect(feed.isEnabled('video')).toBe(false);
      });
    });
  });

  describe('when is not a publisher', () => {
    test('returns true', () => {
      const feed = createFeed({ connection });
      expect(feed.isEnabled('audio')).toBe(true);
      expect(feed.isEnabled('video')).toBe(true);
    });

    describe('and audio/video has been enabled', () => {
      test('returns true', () => {
        const feed = createFeed({ connection });
        feed.setVideoEnabled(true);
        feed.setAudioEnabled(true);
        expect(feed.isEnabled('audio')).toBe(true);
        expect(feed.isEnabled('video')).toBe(true);
      });
    });

    describe('and audio/video has been disabled', () => {
      test('returns false', () => {
        const feed = createFeed({ connection });
        feed.setVideoEnabled(false);
        feed.setAudioEnabled(false);
        expect(feed.isEnabled('audio')).toBe(false);
        expect(feed.isEnabled('video')).toBe(false);
      });
    });
  });
});
