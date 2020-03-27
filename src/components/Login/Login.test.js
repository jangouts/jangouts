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
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');

janusApi.getFeedStream = jest.fn();
Janus.attachMediaStream = jest.fn();

describe('logged in', () => {
  it('redirects to the room', async () => {
    const { findByTestId } = renderWithRedux(
      <MemoryRouter>
        <Route exact path="/" component={Login} />
        <Route path="/room" component={Room} />
      </MemoryRouter>,
      { initialState: { room: { loggedIn: true } } }
    );

    const speaker = await findByTestId('chatbox');
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
        { initialState: { room: { loggedIn: false } } }
      );
    });

    const testRoomOption = await screen.findByText('Test room');
    expect(testRoomOption).toBeInTheDocument();
  });
});
