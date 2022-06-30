/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createFeedsService } from './feeds-service';

const firstObj = { id: 1, name: "first" };
const firstFeed = {
  id: 1,
  getDisplay: () => "first",
  getPublisher: () => true,
  getLocalScreen: () => true,
  getSpeaking: () => false,
  apiObject: () => { return firstObj }
};

const secondObj = { id: 2, name: "second" };
const secondFeed = {
  id: 2,
  getDisplay: () => "second",
  getPublisher: () => false,
  getLocalScreen: () => false,
  getSpeaking: () => true,
  apiObject: () => { return secondObj }
};

const eventsService = { roomEvent: jest.fn(), auditEvent: jest.fn() };

describe('#add', () => {
  beforeEach(() => { jest.resetAllMocks() });

  test('adds the feed', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    expect(feedsService.allFeeds()).toStrictEqual([firstFeed]);
  });

  describe('when adding the main feed', () => {
    const feedsService = createFeedsService(eventsService);

    test('emits events for a new participant (with local=true) and for a new feed', () => {
      feedsService.add(firstFeed, { main: true });
      expect(eventsService.roomEvent).toHaveBeenCalledWith(
        "createParticipant", {...firstObj, local: true}
      );
      expect(eventsService.roomEvent).toHaveBeenCalledWith(
        "createFeed", {...firstObj, participantId: 1}
      );
    });
  });

  describe('when adding a remote feed', () => {
    const feedsService = createFeedsService(eventsService);

    test('emits events for a new participant (with local=false) and for a new feed', () => {
      feedsService.add(firstFeed);
      expect(eventsService.roomEvent).toHaveBeenCalledWith(
        "createParticipant", {...firstObj, local: false }
      );
      expect(eventsService.roomEvent).toHaveBeenCalledWith(
        "createFeed", {...firstObj, participantId: 1}
      );
    });
  });
});

describe('#destroy', () => {
  beforeEach(() => { jest.resetAllMocks() });

  test('removes the feed', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    feedsService.destroy(firstFeed.id);
    expect(feedsService.allFeeds()).toStrictEqual([secondFeed]);
  });

  test('emits destroyFeed and destroyParticipant events', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.destroy(firstFeed.id);

    expect(eventsService.roomEvent).toHaveBeenCalledWith(
      "destroyFeed", { id: firstFeed.id }
    );
    expect(eventsService.roomEvent).toHaveBeenCalledWith(
      "destroyParticipant", { id: firstFeed.id }
    );
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
      return feedsService.waitFor(secondFeed.id, 1, 100)
        .then(console.log)
        .catch((error) => { expect(error).toBe(`feed with id ${secondFeed.id} was not found`);
      });
    });
  });
});

describe('#allFeeds', () => {
  test('returns an array containing the feeds', () => {
    const feedsService = createFeedsService(eventsService);
    feedsService.add(firstFeed);
    feedsService.add(secondFeed);
    expect(feedsService.allFeeds()).toEqual(expect.arrayContaining([firstFeed, secondFeed]));
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
    expect(feedsService.publisherFeeds()).toEqual(expect.arrayContaining([firstFeed]));
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
    expect(feedsService.localScreenFeeds()).toEqual(expect.arrayContaining([firstFeed]));
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
