/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { renderWithRedux } from '../../setupTests';
import { act, screen } from '@testing-library/react';

jest.mock('../../janus-api');

it('renders without crashing', async () => {
  act(() => {
    renderWithRedux(<App />);
  });

  const speaker = await screen.findByText('Room');
});
