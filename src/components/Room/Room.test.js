/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Room from './Room';
import { renderWithRedux } from '../../setupTests';
import { createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('react-router', () => ({
  useParams: jest.fn().mockReturnValue({ roomId: '5678' })
}));

// FIXME: for some reason, calling jest.mock does not work

janusApi.enterRoom = jest.fn(() => Promise.resolve());
janusApi.getFeedStream = jest.fn();
Janus.attachMediaStream = jest.fn();

const initialState = ({ loggedIn }) => ({
  room: { loggedIn },
  participants: [],
  messages: [],
  config: {}
});

describe('when the user is not logged in', () => {
  it('tries to log in taking room and username from the URL', () => {
    const store = mockStore(initialState({ loggedIn: false }));

    renderWithRedux(<Room location={{ search: 'user=Jane' }} />, { store });

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
    const store = mockStore(initialState({ loggedIn: true }));

    renderWithRedux(<Room location={{ search: 'user=Jane' }} />, { store });

    expect(store.getActions()).toEqual([]);
  });
});
