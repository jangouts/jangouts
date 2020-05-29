/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { renderWithRedux } from '../../setupTests';
import { createNotification, Action as NotificationAction } from '../../utils/notifications';
import Notification from './Notification';

const toDispatch = jest.fn();
const actions = [
  new NotificationAction('Do not show again', toDispatch)
];
const notification = createNotification('You have been muted!', 'info', 'muted', actions);
const initialState = {
  notifications: [notification]
};


it('renders without crashing', () => {
  const { getByText } = renderWithRedux(<Notification notification={notification} />, {
    initialState
  });

  expect(getByText(notification.text)).toBeInTheDocument();
});

it('renders the "Do not show again" link if the notification has a type', () => {
  const { getByText } = renderWithRedux(<Notification notification={notification} />, {
    initialState
  });

  expect(getByText("Do not show again")).toBeInTheDocument();
});
