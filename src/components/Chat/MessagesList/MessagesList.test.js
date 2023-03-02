/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MessagesList from './MessagesList';
import { renderWithRedux } from '../../../setupTests';
import { screen } from '@testing-library/react';

// TODO: we should test the auto-scrolling

describe('when there are messages', () => {
  const initialState = {
    messages: {
      list: [
        {
          type: 'chatMsg',
          content: {
            feed: { display: 'John Doe' }
          },
          text: 'Hi Jane!',
          timestamp: '2020-02-10T18:28:58.439Z'
        },
        {
          type: 'chatMsg',
          content: {
            feed: { display: 'Jane Doe' }
          },
          text: "What's up John!",
          timestamp: '2020-02-10T18:29:58.439Z'
        }
      ]
    }
  };

  it('renders all messages', () => {
    renderWithRedux(<MessagesList id={1} display="User" />, {
      initialState
    });

    expect(screen.getAllByTestId('message')).toHaveLength(2);
  });

  it('sets the initial scroll position', () => {
    renderWithRedux(<MessagesList id={1} display="User" />, {
      initialState
    });

    const chatArea = screen.getByRole('log');
    expect(chatArea.scrollTo).toHaveBeenCalled();
  });
});
