/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { UserNotification } from '../../utils/notifications';
import reducer, { actionCreators, initialState } from './notifications';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const notification = new UserNotification('You have been muted.', 'info', 'muted');
const other_notification = new UserNotification('Nobody is listening!');

describe('reducer', () => {
  it('handles NOTIFICATION_SHOW', () => {
    const action = actionCreators.show(notification);
    expect(reducer(initialState, action)).toEqual({...initialState, notifications: [notification]});
  });

  it('handles NOTIFICATION_SHOW blocking further messages of the same type', () => {
    const action = actionCreators.show(notification, true);
    expect(reducer(initialState, action)).toEqual({
      ...initialState, notifications: [notification], blocklist: {[notification.type]: true}
    });
  });

  it('handles NOTIFICATION_CLOSE', () => {
    const action = actionCreators.close(notification.id);
    const state = {...initialState, notifications: [other_notification, notification]};
    const reducedState = reducer(state, action);
    expect(reducedState.notifications).toEqual([other_notification]);
  });

  it('handles NOTIFICATION_BLOCK', () => {
    const type = 'muted';
    const action = actionCreators.block(type);
    const reducedState = reducer(initialState, action);
    expect(reducedState.blocklist).toEqual({muted: true});
  });

  it('handles NOTIFICATION_UNBLOCK', () => {
    const type = 'muted';
    const action = actionCreators.unblock(type);
    const reducedState = reducer({...initialState, blocklist: {[type]: true}}, action);
    expect(reducedState.blocklist).toEqual({});
  });
});

describe('action creators', () => {
  jest.useFakeTimers();

  const event = {
    type: 'muted',
    data: { cause: 'request', source: { id: 1, display: 'Jane' } }
  };

  describe('notifyEvent', () => {
    it('adds a message about an event and removes it after a timeout', () => {
      const store = mockStore({ notifications: initialState });
      store.dispatch(actionCreators.notifyEvent(event));

      expect(store.getActions()).toEqual([
        expect.objectContaining({
          payload: expect.objectContaining({
            notification: expect.objectContaining({
              text: 'You have been muted by Jane.'
            })
          }),
          type: 'jangouts/notification/SHOW'
        })
      ]);

      jest.runAllTimers();
      expect(store.getActions()).toEqual([
        expect.objectContaining({ type: 'jangouts/notification/SHOW' }),
        expect.objectContaining({ type: 'jangouts/notification/CLOSE' })
      ]);
    });

    it('does not add the notification if the type is blocked', () => {
      const store = mockStore(
        { notifications: {...initialState, blocklist: { muted: true } } }
      );
      store.dispatch(actionCreators.notifyEvent(event));
      expect(store.getActions()).toEqual([]);
    });
  });

  describe('block', () => {
    it('adds the message type to the blocklist', () => {
      const store = mockStore({ notifications: initialState });
      store.dispatch(actionCreators.block('muted'));

      expect(store.getActions()).toEqual([
        expect.objectContaining({ type: 'jangouts/notification/BLOCK' })
      ]);
    });
  });

  describe('unblock', () => {
    it('removes the message type from the blocklist', () => {
      const store = mockStore({ notifications: {...initialState, blocklist: ['muted']} });
      store.dispatch(actionCreators.unblock('muted'));

      expect(store.getActions()).toEqual([
        expect.objectContaining({ type: 'jangouts/notification/UNBLOCK' })
      ]);
    });
  });
});
