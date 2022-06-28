/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import LoginForm from './LoginForm';
import { renderWithRedux } from '../../setupTests';
import { act, screen, within } from '@testing-library/react';

jest.mock('../../janus-api');

describe('LoginForm component', () => {
  it('has an input to enter the username', async () => {
    act(() => {
      renderWithRedux(<LoginForm />);
    });
    const username_input = await screen.findByLabelText('Username');
    expect(username_input).toBeInTheDocument();
  });

  it('has a selector with the available rooms', async () => {
    act(() => {
      renderWithRedux(<LoginForm />);
    });

    const room_input = await screen.findByLabelText('Room');
    const test_room = within(room_input).getByText('Test room (5/10 users)');
    expect(test_room).toBeInTheDocument();
   });
});
