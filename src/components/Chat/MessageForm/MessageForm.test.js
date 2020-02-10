/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MessageForm from './MessageForm';
import { renderWithRedux } from '../../../setupTests';

it('renders without crashing', () => {
  renderWithRedux(<MessageForm />);
});

it('renders an input text', () => {
  const { getByPlaceholderText } = renderWithRedux(<MessageForm />);

  expect(getByPlaceholderText('Enter your message here')).toBeInTheDocument();
});

it('renders the "Send" input', () => {
  const { getByDisplayValue } = renderWithRedux(<MessageForm />);

  expect(getByDisplayValue('Send')).toBeInTheDocument();
});
