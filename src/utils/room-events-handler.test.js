/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { createRoomEventsHandler } from './room-events-handler';
import { Subject } from 'rxjs';

import { actionCreators as actions } from '../state/ducks';

describe('#handleFn', () => {
  const dispatchFn = jest.fn();
  const subject = new Subject();
  const eventsHandler = createRoomEventsHandler(dispatchFn);
  subject.subscribe(eventsHandler);

  beforeEach(() => { jest.resetAllMocks() });

  describe('with a reportError event', () => {
    test('dispatchs an error', () => {
      subject.next({ event: 'reportError', payload: { error: "message" }});
      expect(dispatchFn).toHaveBeenCalledWith({ type: 'error' });
    });
  });

  describe('with a createChatMsg event', () => {
    const event = { event: 'createChatMsg', payload: { feedId: '123', text: 'Hey there!' }};
    actions.messages.addChatMsg = jest.fn();

    test('registers the chat message', () => {
      actions.messages.addChatMsg.mockReturnValueOnce({ type: 'chat' });

      subject.next(event);

      expect(actions.messages.addChatMsg).toHaveBeenCalledWith('123', 'Hey there!');
      expect(dispatchFn).toHaveBeenCalledWith({ type: 'chat' });
    });

    describe('if the message includes dangerous markup (eg. XSS attacks)', () => {
      const text = '<p><script>alert(1)</script></p>';
      const event = { event: 'createChatMsg', payload: { feedId: 1, text }};

      test('register the chat with a sanitized text', () => {
        actions.messages.addChatMsg.mockReturnValueOnce({ type: 'chatSanitized' });

        subject.next(event);

        expect(actions.messages.addChatMsg).toHaveBeenCalledWith(1, '<p></p>');
        expect(dispatchFn).toHaveBeenCalledWith({ type: 'chatSanitized' });
      });
    });

    describe('if the text is empty after sanitation', () => {
      const text = '<script>alert(1)</script>';
      const event = { event: 'createChatMsg', payload: { feedId: 1, text }};

      test('ignores the message', () => {
        subject.next(event);
        expect(dispatchFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('with a createFeed event', () => {
    const local = { id: 123, local: true, name: 'rms', video: false };
    const remote = { id: 456, local: false, display: 'dknuth', video: false };
    actions.messages.add = jest.fn();

    describe('for a new local feed', () => {
      const event = { event: 'createFeed', payload: local };

      test('registers the feed as new participant', () => {
        subject.next(event);
        expect(dispatchFn).toHaveBeenCalledWith(actions.participants.addParticipant(local));
      });

      test('does not generate a newRemoteFeed message', () => {
        subject.next(event);
        expect(actions.messages.add).not.toHaveBeenCalled();
      });
    });

    describe('for a new remote feed', () => {
      const event = { event: 'createFeed', payload: remote };

      test('registers the feed as new participant', () => {
        subject.next(event);
        expect(dispatchFn).toHaveBeenCalledWith(actions.participants.addParticipant(remote));
      });

      test('registers a newRemoteFeed message', () => {
        actions.messages.add.mockReturnValueOnce({ type: 'remoteFeed', id: remote.id });

        subject.next(event);
        expect(actions.messages.add).toHaveBeenCalledWith('newRemoteFeed', remote);
        expect(dispatchFn).toHaveBeenCalledWith({ type: 'remoteFeed', id: remote.id });
      });
    });
  });

  describe('with a destroyParticipant event', () => {
    const event = { event: 'destroyParticipant', payload: { id: 1 } };
    actions.participants.removeParticipant = jest.fn();

    test('dispatchs the removal of the participant', () => {
      actions.participants.removeParticipant.mockReturnValueOnce({ type: 'detach' });

      subject.next(event);
      expect(actions.participants.removeParticipant).toHaveBeenCalledWith(1);
      expect(dispatchFn).toHaveBeenCalledWith({ type: 'detach' });
    });
  });

  describe('with an updateFeed event', () => {
    const source = '1234';
    const status = { video: false, audio: true, display: 'Jane' };
    const event = { event: 'updateFeed', payload: { id: source, ...status } };

    test('dispatchs an update for the corresponding feed', () => {
      subject.next(event);
      expect(dispatchFn).toHaveBeenCalledWith(
        actions.participants.updateStatus(
          '1234',
          { audio: true, video: false, display: 'Jane', id: '1234' }
        )
      );
    });
  });

  describe('with a updateStream event', () => {
    const feedId = 321;
    const event = { event: 'updateStream', payload: { feedId, stream: 'theStream' }};
    actions.participants.setStream = jest.fn();

    test('assigns the stream to the given feed', () => {
      actions.participants.setStream.mockReturnValueOnce({ type: 'stream', feedId });

      subject.next(event);
      expect(actions.participants.setStream).toHaveBeenCalledWith(feedId, 'theStream');
      expect(dispatchFn).toHaveBeenCalledWith({ type: 'stream', feedId });
    });
  });
});
