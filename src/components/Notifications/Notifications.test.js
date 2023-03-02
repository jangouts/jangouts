/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { renderWithRedux } from '../../setupTests';
import { createNotification } from '../../utils/notifications';
import Notifications from './Notifications';
import { screen } from '@testing-library/react';

const notification1 = createNotification('You have been muted.');
const notification2 = createNotification('Nobody is listening!');
const initialState = {
  notifications: { notifications: [notification1, notification2], blocklist: [] }
};

it('renders without crashing', () => {
  renderWithRedux(<Notifications />, { initialState });
  expect(screen.getByText(notification1.text)).toBeInTheDocument();
  expect(screen.getByText(notification2.text)).toBeInTheDocument();
});
