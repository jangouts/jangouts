/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MessagesList from './MessagesList';
import { renderWithRedux } from '../../../setupTests';
import { act } from '@testing-library/react';

// TODO: we should test the auto-scrolling

it('renders without crashing', () => {
  act(() => {
    renderWithRedux(<MessagesList id={1} display="User" />);
  });
});

describe('when there are messages', () => {
  const initialState = {
    messages: [
      {
        type: 'chatMsg',
        content: {
          feed: { display: 'John Doe' }
        },
        text: () => 'Hi Jane!',
        timestamp: '2020-02-10T18:28:58.439Z'
      },
      {
        type: 'chatMsg',
        content: {
          feed: { display: 'Jane Doe' }
        },
        text: () => "What's up John!",
        timestamp: '2020-02-10T18:29:58.439Z'
      }
    ]
  };

  it('renders all messages', () => {
    const { getAllByTestId } = renderWithRedux(<MessagesList id={1} display="User" />, {
      initialState
    });

    expect(getAllByTestId('message')).toHaveLength(2);
  });

  it('sets the initial scroll position', () => {
    const { getByRole } = renderWithRedux(<MessagesList id={1} display="User" />, {
      initialState
    });

    const chatArea = getByRole('log');

    expect(chatArea.scrollTo).toHaveBeenCalled()
  });
});
