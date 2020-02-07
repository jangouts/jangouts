/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import LoginForm from './LoginForm';
import { renderWithRedux } from '../../setupTests';
import { act, screen } from '@testing-library/react';

jest.mock('../../janus-api');

describe('LoginForm component', () => {
  it('has an input to enter the username', async () => {
    act(() => {
      renderWithRedux(<LoginForm />);
    });
    const username_input = await screen.findByLabelText('Username');
    const room_input = await screen.findByLabelText('Room');
    expect(username_input).toBeInTheDocument();
    expect(room_input).toBeInTheDocument();
  });
});
