/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { createFeedsService } from './feeds-service';

const firstFeed = {
  id: 1,
  isPublisher: true,
  isLocalScreen: true,
  getSpeaking: () => false
};

const secondFeed = {
  id: 2,
  isPublisher: false,
  isLocalScreen: false,
  getSpeaking: () => true
};

const emitEvent = jest.fn();
const eventsService = { emitEvent };

describe('#add', () => {
  test('adds the feed', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    expect(feedsService.allFeeds()).toStrictEqual([firstFeed]);
  });

  test('emits a new feed event', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    expect(eventsService.emitEvent).toHaveBeenCalledWith({
      type: 'addFeed',
      data: firstFeed
    });
  });
});

describe('#destroy', () => {
  test('removes the feed', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    feedsService.destroy(firstFeed.id);
    expect(feedsService.allFeeds()).toStrictEqual([secondFeed]);
  });

  test('emits a new feed event', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.destroy(firstFeed.id);
    expect(eventsService.emitEvent).toHaveBeenCalledWith({
      type: 'removeFeed',
      data: { feedId: firstFeed.id }
    });
  });
});

describe('#find', () => {
  describe('when the feed does not exist', () => {
    test('returns null', () => {
      const feedsService = createFeedsService(eventsService);
      expect(feedsService.find(1)).toBe(null);
    });
  });

  describe('when the feed exists', () => {
    test('returns the feed with the given id', () => {
      const feedsService = createFeedsService(eventsService);
      feedsService.add(firstFeed);
      feedsService.add(secondFeed);
      expect(feedsService.find(secondFeed.id)).toBe(secondFeed);
    });
  });
});

describe('#find', () => {
  describe('when the feed does not exist', () => {
    test('returns null', () => {
      const feedsService = createFeedsService(eventsService);
      expect(feedsService.find(1)).toBe(null);
    });
  });

  describe('when the feed exists', () => {
    test('returns the feed with the given id', () => {
      const feedsService = createFeedsService(eventsService);
      feedsService.add(firstFeed);
      feedsService.add(secondFeed);
      expect(feedsService.find(secondFeed.id)).toBe(secondFeed);
    });
  });
});

describe('#waitFor', () => {
  test('returns the feed with the given id', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    return feedsService.waitFor(secondFeed.id, 1, 100).then((result) => {
      expect(result).toBe(secondFeed);
    });
  });

  describe('when a feed with the given', () => {
    test('returns null', () => {
      const feedsService = createFeedsService();
      return feedsService.waitFor(secondFeed.id, 1, 100).catch((error) => {
        expect(error).toBe(`feed with id ${secondFeed.id} was not found`);
      });
    });
  });
});

describe('#allFeeds', () => {
  test('returns an array containing the feeds', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    expect(feedsService.allFeeds()).toEqual(
      expect.arrayContaining([firstFeed, secondFeed])
    );
  });

  describe('when there are no feeds', () => {
    test('returns an empty array', () => {
      const feedsService = createFeedsService(eventsService);
      expect(feedsService.allFeeds()).toStrictEqual([]);
    });
  });
});

describe('#publisherFeeds', () => {
  test('returns an array containing the publisher feeds', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    expect(feedsService.publisherFeeds()).toEqual(
      expect.arrayContaining([firstFeed])
    );
  });

  describe('when there are no feeds', () => {
    test('returns an empty array', () => {
      const feedsService = createFeedsService();
      expect(feedsService.publisherFeeds()).toStrictEqual([]);
    });
  });
});

describe('#localScreenFeeds', () => {
  test('returns an array containing the publisher feeds', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    expect(feedsService.localScreenFeeds()).toEqual(
      expect.arrayContaining([firstFeed])
    );
  });

  describe('when there are no feeds', () => {
    test('returns an empty array', () => {
      const feedsService = createFeedsService();
      expect(feedsService.localScreenFeeds()).toStrictEqual([]);
    });
  });
});

describe('#speakingFeed', () => {
  test('returns the feed which is speaking', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    expect(feedsService.speakingFeed()).toBe(secondFeed);
  });
});
