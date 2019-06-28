/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { createDataChannelService } from './data-channel-service';
import { createLogService } from './log-service';
import { createFeedsService } from './feeds-service';
import { createFeedFactory } from './models/feed';
import { createFeedConnection } from './models/feed-connection';

describe('#sendChatMessage', () => {
  const eventsService = {
    emitEvent: jest.fn()
  };

  const mainConnection = {
    sendData: jest.fn()
  };

  const mainFeed = {
    connection: mainConnection,
    isDataOpen: () => true
  };

  const feedsService = {
    findMain: () => mainFeed
  };

  test('sends the message through the main connection', () => {
    let logService = createLogService;
    let dataService = createDataChannelService(
      feedsService,
      logService,
      eventsService
    );

    dataService.sendChatMessage("Hello Dolly!");
    var sentData = mainConnection.sendData.mock.calls;
    var parsed = JSON.parse(sentData[0][0]["text"]);

    expect(sentData.length).toBe(1);
    expect(parsed).toStrictEqual({
      "type": "chatMsg",
      "content": "Hello Dolly!"
    });
  });
});

describe('#receiveMessage', () => {
  const logService = {
    add: jest.fn()
  };

  const eventsService = {
    emitEvent: jest.fn()
  };

  const feedsService = createFeedsService(eventsService);

  const dataService = createDataChannelService(
    feedsService,
    logService,
    eventsService
  );

  const createFeed = createFeedFactory(dataService, eventsService);

  const pluginHandle = {
    getId: () => 1,
    getPlugin: () => 'videoroom',
    // Execute the callback if a confirmation is received
    send: options => {
      options['success']();
    }
  };
  const createConnection = createFeedConnection(eventsService);

  const publish_conn = createConnection(pluginHandle, 222, 'publisher');
  const publish_feed = createFeed({
    id: 1,
    isPublisher: true,
    connection: publish_conn
  });
  const subscribe_feed = createFeed({ id: 2 });

  feedsService.add(publish_feed);
  feedsService.add(subscribe_feed);

  function last_log() {
    var calls = logService.add.mock.calls;
    var last_call = calls[calls.length - 1];
    return last_call[0];
  }

  function last_event() {
    var calls = eventsService.emitEvent.mock.calls;
    var last_call = calls[calls.length - 1];
    return last_call ? last_call[0] : null;
  }

  describe('receiving a chatMsg', () => {
    test('register the corresponding log entry', () => {
      let data = JSON.stringify({
        type: 'chatMsg',
        content: 'Goodbye Molly!'
      });

      dataService.receiveMessage(data, 1);
      var entry = last_log();

      expect(entry.type).toStrictEqual('chatMsg');
      expect(entry.chatMsgText()).toStrictEqual('Goodbye Molly!');
      expect(entry.content.feed).toBe(publish_feed);
    });
  });

  describe('receiving a muteRequest', () => {
    describe('for the publisher feed', () => {
      test('register the log entry and emits the event after receiving confirmation', () => {
        let data = JSON.stringify({
          type: 'muteRequest',
          content: { target: 1 }
        });

        dataService.receiveMessage(data, 2);

        var entry = last_log();
        expect(entry.type).toStrictEqual('muteRequest');
        expect(entry.content.target).toBe(publish_feed);

        var ev = last_event();
        expect(ev.type).not.toStrictEqual('muted');

        publish_feed.connection.confirmConfig();

        ev = last_event();
        expect(ev.type).toStrictEqual('muted');
        expect(ev.data.cause).toStrictEqual('request');
      });
    });

    describe('for a subscriber feed', () => {
      test('register the log entry', () => {
        let data = JSON.stringify({
          type: 'muteRequest',
          content: { target: 2 }
        });

        dataService.receiveMessage(data, 1);

        var entry = last_log();
        expect(entry.type).toStrictEqual('muteRequest');
        expect(entry.content.target).toBe(subscribe_feed);
      });
    });
  });
});
