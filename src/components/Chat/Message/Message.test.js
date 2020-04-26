/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Message from './Message';
import { render } from '@testing-library/react';

// TODO: I was not able to test the emoji matcher. Not even after checking how it is done here:
// https://github.com/milesj/interweave/blob/master/packages/emoji/tests/Interweave.test.tsx

const plainMessage = {
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
  render(<Message {...plainMessage} />);
});

it('renders the user name', () => {
  const { getByText } = render(<Message {...plainMessage} />);

  expect(getByText('John')).toBeInTheDocument();
});

it('renders the message', () => {
  const { getByText } = render(<Message {...plainMessage} />);

  expect(getByText('Hi Jane!')).toBeInTheDocument();
});

it('renders the time in HH:MM format', () => {
  const { getByText } = render(<Message {...plainMessage} />);

  expect(getByText('18:01')).toBeInTheDocument();
});

const htmlMessage = {
  type: 'chatMsg',
  text: () => 'This is <b>bold</b> and this an <script>window.alert();</script> injection!',
  content: {
    feed: {
      display: 'John'
    }
  },
  timestamp: '2020-02-10T18:02:58.439Z'
};

it('filters out the dangerous HTML markup', () => {
  const { getByTestId } = render(<Message {...htmlMessage} />);

  expect(getByTestId('message')).not.toContainHTML('<script>');
  expect(getByTestId('message')).not.toContainHTML('window.alert');
});

it('keeps the acceptable HTML markup', () => {
  const { getByTestId } = render(<Message {...htmlMessage} />);

  expect(getByTestId('message')).toContainHTML('<b>bold</b>');
});

const imgMessage = {
  type: 'chatMsg',
  text: () => 'Link to a logo http://www.google.com/logo.png',
  content: {
    feed: {
      display: 'John'
    }
  },
  timestamp: '2020-02-10T18:02:58.439Z'
};

it('renders images inline', () => {
  const { getByTestId } = render(<Message {...imgMessage} />);

  expect(getByTestId('message')).toContainHTML('<img src="http://www.google.com/logo.png"');
});
