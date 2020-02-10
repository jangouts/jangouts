/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './Chat';
import { renderWithRedux } from '../../setupTests';
import { createLogEntry } from '../../janus-api/models/log-entry';

it('renders without crashing', () => {
  renderWithRedux(<Chat />);
});

it('renders a chatbox', () => {
  const { getByTestId } = renderWithRedux(<Chat />);

  expect(getByTestId('chatbox')).toBeInTheDocument();
});

describe('when there are messages', () => {
  const sender = {
    display: 'John',
    isPublisher: false
  };

  const message = createLogEntry('chatMsg', { feed: sender, text: 'Hi all!' });

  const stateWithMessage = {
    messages: [message]
  };

  it('lists the messages', () => {
    const { getByTestId, getByText } = renderWithRedux(<Chat />, {
      initialState: stateWithMessage
    });
    expect(getByText('Hi all!')).not.toBeNull();
  });
});
