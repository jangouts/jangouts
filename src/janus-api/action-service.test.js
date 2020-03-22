/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createActionService } from './action-service';

const localFeed = { setVideoSubscription: jest.fn() };
const remoteFeed = { setVideoSubscription: jest.fn() };

const feedsService = {
  allFeeds: () => [localFeed, remoteFeed],
  remoteFeeds: () => [remoteFeed]
};

const actionService = createActionService(feedsService);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('#enableVideoSubscriptions', () => {
  test('sets the video subscription for all remote feeds', () => {
    actionService.enableVideoSubscriptions();

    expect(localFeed.setVideoSubscription).not.toHaveBeenCalled();
    expect(remoteFeed.setVideoSubscription).toHaveBeenCalledWith(true);
  });
});

describe('#disableVideoSubscriptions', () => {
  test('removes the video subscription for all remote feeds', () => {
    actionService.disableVideoSubscriptions();

    expect(localFeed.setVideoSubscription).not.toHaveBeenCalled();
    expect(remoteFeed.setVideoSubscription).toHaveBeenCalledWith(false);
  });
});
