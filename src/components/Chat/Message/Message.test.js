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
  ...plainMessage,
  text: 'This is <b>bold</b> and this an <script>window.alert();</script> injection!'
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
  ...plainMessage,
  text: 'Link to a logo http://www.google.com/logo.png'
};

it('renders images inline', () => {
  const { getByTestId } = render(<Message {...imgMessage} />);

  expect(getByTestId('message')).toContainHTML('<img src="http://www.google.com/logo.png"');
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
  const { getByTestId } = render(<Message {...formattedMessage} />);

  expect(getByTestId('message')).toContainHTML('Some <b>bold</b>,');
  expect(getByTestId('message')).toContainHTML(' <i>italic</i> ');
  expect(getByTestId('message')).toContainHTML(' <b><i>combined</i></b>.');
});

it('formats correctly text with redundant markup', () => {
  const { getByTestId } = render(<Message {...redundantFormatMessage} />);

  expect(getByTestId('message')).toContainHTML('Very <b>bold</b> and');
});

it('formats correctly text with asymmetric markup', () => {
  const { getByTestId } = render(<Message {...redundantFormatMessage} />);

  expect(getByTestId('message')).toContainHTML('<b>*unbalanced</b>.');
});
