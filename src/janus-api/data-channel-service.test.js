/**
* Copyright (c) [2019] SUSE Linux
*
* This software may be modified and distributed under the terms
* of the MIT license.  See the LICENSE.txt file for details.
*/

import { createDataChannelService } from './data-channel-service';
import { createLogService } from './log-service';

describe('#sendChatMessage', () => {
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
    let dataService = createDataChannelService(feedsService, logService);

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

  const feed = {};

  const feedsService = {
    find: (id) => id === 1 ? feed : null
  };

  describe('receiving a chatMsg', () => {
    test('register the corresponding log entry', () => {
      let dataService = createDataChannelService(feedsService, logService);
      let data = JSON.stringify({
        type: "chatMsg",
        content: "Goodbye Molly!"
      });

      dataService.receiveMessage(data, 1);
      var logged = logService.add.mock.calls;
      var entry = logged[0][0];

      expect(logged.length).toBe(1);
      expect(entry.type).toStrictEqual("chatMsg");
      expect(entry.chatMsgText()).toStrictEqual("Goodbye Molly!");
      expect(entry.content.feed).toBe(feed);
    });
  });
});
