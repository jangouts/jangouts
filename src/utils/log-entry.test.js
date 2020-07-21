/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createLogEntry } from './log-entry';

const me = {
  display: 'Jane',
  isPublisher: true
};

const other = {
  display: 'John',
  isPublisher: false
};

describe('#text', () => {
  describe('mute request entry', () => {
    test('when you mute another participant', () => {
      const content = { source: me, target: other };
      const entry = createLogEntry('muteRequest', content);
      expect(entry.text()).toBe('You have muted John');
    });

    test('when you are muted by another participant', () => {
      const content = { source: other, target: me };
      const entry = createLogEntry('muteRequest', content);
      expect(entry.text()).toBe('John has muted you');
    });
  });

  describe('chat message entry', () => {
    test('displays the message as it is', () => {
      const content = { text: 'some text' };
      const entry = createLogEntry('chatMsg', content);
      expect(entry.text()).toBe('some text');
    });
  });

  xdescribe('publishScreenText');
  xdescribe('destroyFeedText');
  xdescribe('newRemoteFeedText');
  xdescribe('ignoreFeedText');
  xdescribe('reconnectFeedText');
});

xdescribe('#hasText');
