/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Message from './Message';
import { render } from '@testing-library/react';

const message = {
  type: 'chatMsg',
  text: () => 'Hi Jane!',
  content: {
    feed: {
      display: 'John'
    }
  },
  timestamp: '2020-02-10T18:01:58.439Z'
};

it('renders without crashing', () => {
  render(<Message {...message} />);
});

it('renders the user name', () => {
  const { getByText } = render(<Message {...message} />);

  expect(getByText('John')).toBeInTheDocument();
});

it('renders the message', () => {
  const { getByText } = render(<Message {...message} />);

  expect(getByText('Hi Jane!')).toBeInTheDocument();
});

it('renders the time in HH:MM format', () => {
  const { getByText } = render(<Message {...message} />);

  expect(getByText('18:01')).toBeInTheDocument();
});
