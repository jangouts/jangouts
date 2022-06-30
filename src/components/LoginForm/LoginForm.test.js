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
    renderWithRedux(<LoginForm />);

    const username_input = await screen.findByLabelText('Username');
    expect(username_input).toBeInTheDocument();
  });

  it('has a selector with the available rooms sorted by the shown text', async () => {
    renderWithRedux(<LoginForm />);

    const room_input = await screen.findByLabelText('Room');
    const options = within(room_input).getAllByRole('option');
    expect(options[0].text).toBe('Another test room (2/10 users)');
    expect(options[1].text).toBe('Test room (5/10 users)');
    expect(options[2].text).toBe('Test room 3 (0/10 users)');
  });
});
