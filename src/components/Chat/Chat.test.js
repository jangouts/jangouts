/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Chat from './Chat';
import { renderWithRedux } from '../../setupTests';
import { createLogEntry } from '../../utils/log-entry';
import { screen } from '@testing-library/react';

it('renders without crashing', () => {
  renderWithRedux(<Chat />);
});

it('renders a chatbox', () => {
  renderWithRedux(<Chat />);

  expect(screen.getByTestId('chatbox')).toBeInTheDocument();
});

describe('when there are messages', () => {
  const sender = {
    display: 'John',
    isPublisher: false
  };
  const message = createLogEntry('chatMsg', { feed: sender, text: 'Hi all!' });
  const stateWithMessage = {
    messages: [{...message, text: message.text()}]
  };

  it('lists the messages', () => {
    renderWithRedux(<Chat />, { initialState: stateWithMessage });
    expect(screen.getByText('Hi all!')).not.toBeNull();
  });
});
