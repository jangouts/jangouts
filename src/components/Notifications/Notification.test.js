/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { renderWithRedux } from '../../setupTests';
import { UserNotification } from '../../utils/notifications';
import Notification from './Notification';

const notification = new UserNotification('You have been muted!');
const initialState = {
  notifications: [notification]
};

it('renders without crashing', () => {
  const { getByText } = renderWithRedux(<Notification notification={notification} />, {
    initialState
  });
  expect(getByText(notification.text)).toBeInTheDocument();
});
