/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Login from './Login';
import Room from '../Room';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import { renderWithRedux } from '../../setupTests';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');

janusApi.getFeedStream = jest.fn();
Janus.attachMediaStream = jest.fn();

describe('logged in', () => {
  it('redirects to the room', async () => {
    renderWithRedux(
      <MemoryRouter>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route path="/room/:roomId" element={<Room/>} />
        </Routes>
      </MemoryRouter>,
      { initialState: { room: { loggedIn: true } } }
    );

    const speaker = await screen.findByTestId('chatbox');
    expect(speaker).toBeInTheDocument();
  });
});

describe('not logged in', () => {
  it('displays the list of rooms', async () => {
    renderWithRedux(
      <MemoryRouter>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route path="/room/:roomId" element={<Room/>} />
        </Routes>
      </MemoryRouter>,
      { initialState: { room: { loggedIn: false } } }
    );

    const roomSelector = await screen.findByRole("combobox");
    await within(roomSelector).findByText("Test room (5/10 users)");
  });
});
