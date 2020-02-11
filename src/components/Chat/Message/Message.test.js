/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Message from './Message';
import { render } from '@testing-library/react';

const text = 'Hi Jane!';
const username = 'John Doe';
const timestamp = '2020-02-10T18:01:58.439Z';

it('renders without crashing', () => {
  render(<Message />);
});

it('renders the user name', () => {
  const { getByText } = render(<Message username={username} text={text} timestamp={timestamp} />);

  expect(getByText('John Doe')).toBeInTheDocument();
});

it('renders the message', () => {
  const { getByText } = render(<Message username={username} text={text} timestamp={timestamp} />);

  expect(getByText('Hi Jane!')).toBeInTheDocument();
});

it('renders the time in HH:MM format', () => {
  const { getByText } = render(<Message username={username} text={text} timestamp={timestamp} />);

  expect(getByText('18:01')).toBeInTheDocument();
});
