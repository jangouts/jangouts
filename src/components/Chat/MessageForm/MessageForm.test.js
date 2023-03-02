/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MessageForm from './MessageForm';
import { renderWithRedux } from '../../../setupTests';
import { screen } from '@testing-library/react';

it('renders without crashing', () => {
  renderWithRedux(<MessageForm />);
});

it('renders an input text', () => {
  renderWithRedux(<MessageForm />);

  expect(screen.getByPlaceholderText('Enter your message here')).toBeInTheDocument();
});

it('renders the "Send" input', () => {
  renderWithRedux(<MessageForm />);

  expect(screen.getByDisplayValue('Send')).toBeInTheDocument();
});
