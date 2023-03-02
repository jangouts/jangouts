/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createDataChannelService } from './data-channel-service';
import { createFeedsService } from './feeds-service';
import { createFeedFactory } from './models/feed';

describe('#sendChatMessage', () => {
  const eventsService = {
    roomEvent: jest.fn()
  };

  const mainConnection = {
    sendData: jest.fn()
  };

  const mainFeed = {
    id: 666,
    connection: mainConnection,
    isDataOpen: () => true
  };

  const feedsService = {
    findMain: () => mainFeed
  };

  test('emits a room event and sends the message through the main connection', () => {
    let dataService = createDataChannelService(feedsService, eventsService);

    dataService.sendChatMessage('Hello Dolly!');

    expect(eventsService.roomEvent).toHaveBeenCalledWith(
      'createChatMsg', { feedId: 666, text: 'Hello Dolly!'}
    );

    let sentData = mainConnection.sendData.mock.calls;
    let parsed = JSON.parse(sentData[0][0]['text']);

    expect(sentData.length).toBe(1);
    expect(parsed).toStrictEqual({
      type: 'chatMsg',
      content: 'Hello Dolly!'
    });
  });
});

describe('#receiveMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const eventsService = { roomEvent: jest.fn() };
  const feedsService = createFeedsService(eventsService);
  const dataService = createDataChannelService(feedsService, eventsService);
  const createFeed = createFeedFactory(dataService, eventsService);

  const publishConnection = { setConfig: jest.fn(), getConfig: () => {} };
  const publishFeed = createFeed({ id: 1, isPublisher: true, connection: publishConnection });
  const subscribeConnection = { setConfig: jest.fn() };
  const subscribeFeed = createFeed({ id: 2, connection: subscribeConnection });

  feedsService.add(publishFeed);
  feedsService.add(subscribeFeed);

  describe('receiving a chatMsg', () => {
    test('emits the corresponding event', () => {
      let data = JSON.stringify({
        type: 'chatMsg',
        content: 'Goodbye Molly!'
      });

      dataService.receiveMessage(data, 1);

      expect(eventsService.roomEvent).toHaveBeenLastCalledWith(
        'createChatMsg', { feedId: 1, text: 'Goodbye Molly!'}
      );
    });
  });

  describe('receiving a muteRequest', () => {
    describe('for the publisher feed', () => {
      test('emits the event and disables the audio channel', () => {
        let data = JSON.stringify({
          type: 'muteRequest',
          content: { target: 1 }
        });
        dataService.receiveMessage(data, 2);

        expect(eventsService.roomEvent).toHaveBeenLastCalledWith(
          'muteFeed', { id: publishFeed.id, requesterId: subscribeFeed.id  }
        );
        expect(publishConnection.setConfig).toHaveBeenCalledWith(
          expect.objectContaining({ values: { audio: false }})
        );
      });
    });

    describe('for a subscriber feed', () => {
      test('emits the corresponding event and does not modify the channels', () => {
        let data = JSON.stringify({
          type: 'muteRequest',
          content: { target: 2 }
        });

        dataService.receiveMessage(data, 1);

        expect(eventsService.roomEvent).toHaveBeenLastCalledWith(
          'muteFeed', { id: subscribeFeed.id, requesterId: publishFeed.id  }
        );
        expect(publishConnection.setConfig).not.toHaveBeenCalled();
        expect(subscribeConnection.setConfig).not.toHaveBeenCalled();
      });
    });
  });
});
