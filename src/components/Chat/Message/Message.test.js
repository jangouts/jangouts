/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Message from './Message';
import { render, screen } from '@testing-library/react';

// TODO: I was not able to test the emoji matcher. Not even after checking how it is done here:
// https://github.com/milesj/interweave/blob/master/packages/emoji/tests/Interweave.test.tsx

const plainMessage = {
  type: 'chatMsg',
  text: 'Hi Jane!',
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
  render(<Message {...plainMessage} />);

  expect(screen.getByText('John')).toBeInTheDocument();
});

it('renders the message', () => {
  render(<Message {...plainMessage} />);

  expect(screen.getByText('Hi Jane!')).toBeInTheDocument();
});

it('renders the time in HH:MM format', () => {
  render(<Message {...plainMessage} />);

  expect(screen.getByText('18:01')).toBeInTheDocument();
});

const htmlMessage = {
  ...plainMessage,
  text: 'This is <b>bold</b> and this an <script>window.alert();</script> injection!'
};

it('filters out the dangerous HTML markup', () => {
  render(<Message {...htmlMessage} />);

  expect(screen.getByTestId('message')).not.toContainHTML('<script>');
  expect(screen.getByTestId('message')).not.toContainHTML('window.alert');
});

it('keeps the acceptable HTML markup', () => {
  render(<Message {...htmlMessage} />);

  expect(screen.getByTestId('message')).toContainHTML('<b>bold</b>');
});

const imgMessage = {
  ...plainMessage,
  text: 'Link to a logo http://www.google.com/logo.png'
};

it('renders images inline', () => {
  render(<Message {...imgMessage} />);

  expect(screen.getByTestId('message')).toContainHTML('<img src="http://www.google.com/logo.png"');
});

const formattedMessage = {
  ...plainMessage,
  text: 'Some *bold*, _italic_ and *_combined_*.'
};

const redundantFormatMessage = {
  ...plainMessage,
  text: 'Very **bold** and **unbalanced*.'
};

it('formats bold and italic text', () => {
  render(<Message {...formattedMessage} />);

  expect(screen.getByTestId('message')).toContainHTML('Some <b>bold</b>,');
  expect(screen.getByTestId('message')).toContainHTML(' <i>italic</i> ');
  expect(screen.getByTestId('message')).toContainHTML(' <b><i>combined</i></b>.');
});

it('formats correctly text with redundant markup', () => {
  render(<Message {...redundantFormatMessage} />);

  expect(screen.getByTestId('message')).toContainHTML('Very <b>bold</b> and');
});

it('formats correctly text with asymmetric markup', () => {
  render(<Message {...redundantFormatMessage} />);

  expect(screen.getByTestId('message')).toContainHTML('<b>*unbalanced</b>.');
});
