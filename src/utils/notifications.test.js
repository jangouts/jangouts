/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { fromEvent, SEVERITY_INFO } from './notifications';

describe('fromEvent', () => {
  it('when the user is muted by another user', () => {
    const notification = fromEvent({
      type: 'muted',
      data: { cause: 'request', source: { id: 1, display: 'Jane' } }
    });

    expect(notification.text).toContain('by Jane.');
    expect(notification.severity).toEqual(SEVERITY_INFO);
  });

  it('when the user is muted due to the room limit', () => {
    const notification = fromEvent({
      type: 'muted',
      data: { cause: 'join', limit: 3 }
    });

    expect(notification.text).toContain('there are already 3 participants');
    expect(notification.severity).toEqual(SEVERITY_INFO);
  });

  it('when the user is muted due to the room limit being 0', () => {
    const notification = fromEvent({
      type: 'muted',
      data: { cause: 'join', limit: 0 }
    });

    expect(notification.text).toContain('everyone who enters a room');
    expect(notification.severity).toEqual(SEVERITY_INFO);
  });

  it('when the user muted him/herself', () => {
    const notification = fromEvent({
      type: 'muted',
      data: { cause: 'user', limit: 0 }
    });

    expect(notification).toBeNull();
  })

  it('when the user started sharing the screen', () => {
    const notification = fromEvent({
      type: 'screenshare',
      data: { status: 'started' }
    });

    expect(notification.text).toContain('You started sharing');
    expect(notification.severity).toEqual(SEVERITY_INFO);
  });

  it('when the user stopped sharing the screen', () => {
    const notification = fromEvent({
      type: 'screenshare',
      data: { status: 'stopped' }
    });

    expect(notification.text).toContain('You stopped sharing');
    expect(notification.severity).toEqual(SEVERITY_INFO);
  });

  it('when the event is unknown', () => {
    const notification = fromEvent({
      type: 'unknown'
    });

    expect(notification).toBeNull();
  });
});
