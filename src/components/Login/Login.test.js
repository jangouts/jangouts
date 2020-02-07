/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Login from './Login';
import Room from '../Room';
import { MemoryRouter, Route } from 'react-router-dom';
import { act, screen } from '@testing-library/react';
import { renderWithRedux } from '../../setupTests';

jest.mock('../../janus-api');

describe('logged in', () => {
  it('redirects to the room', async () => {
    const { findByText } = renderWithRedux(
      <MemoryRouter>
        <Route exact path="/" component={Login} />
        <Route path="/room" component={Room} />
      </MemoryRouter>,
      { initialState: { room: { logedIn: true } } }
    );

    const speaker = await findByText('Speaker');
    expect(speaker).toBeInTheDocument();
  });
});

describe('not logged in', () => {
  it('displays the list of rooms', async () => {
    act(() => {
      renderWithRedux(
        <MemoryRouter>
          <Route exact path="/" component={Login} />
          <Route path="/room" component={Room} />
        </MemoryRouter>,
        { initialState: { room: { logedIn: false } } }
      );
    });

    const testRoomOption = await screen.findByText('Test room');
    expect(testRoomOption).toBeInTheDocument();
  });
});
