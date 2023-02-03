/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Room from './Room';
import { renderWithRedux } from '../../setupTests';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';
import { initialState } from '../../state/ducks';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ search: '?user=Jane' }),
  useParams: () => ({ roomId: '5678' })
}));

jest.mock('react-router', () => ({
  Navigate: () => <></>
}));

// FIXME: for some reason, calling jest.mock does not work
janusApi.enterRoom = (room, username, pin) => Promise.resolve();
janusApi.getRooms= () => Promise.resolve([]);
Janus.attachMediaStream = jest.fn();

describe('when the user is not logged in', () => {
  it('tries to log in taking room and username from the URL', () => {
    const store = mockStore({ ...initialState, room: { ...initialState.room, loggedIn: false } });
    renderWithRedux(<Room location={{ search: '?user=Jane' }} />, { store });

    expect(store.getActions()).toEqual([
      {
        type: 'jangouts/room/LOGIN_REQUEST',
        payload: { roomId: 5678, username: 'Jane' }
      }
    ]);
  });
});

describe('when the user is logged in', () => {
  it('does not try to log in', () => {
    const store = mockStore({ ...initialState, room: { ...initialState.room, loggedIn: true } });
    renderWithRedux(<Room location={{ search: 'user=Jane' }} />, { store });

    expect(store.getActions()).toEqual([]);
  });
});
