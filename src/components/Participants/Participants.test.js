/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Participants from './Participants';
import { screen, within } from '@testing-library/react';
import { renderWithRedux } from '../../setupTests';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');
Janus.attachMediaStream = jest.fn();

jest.mock('../Participant', () => ({ username }) => <div>{username}</div>);

const initialState = {
  participants: {
    1: { id: 1, display: 'Jane', active: true, isPublisher: true, audio: true },
    2: { id: 2, display: 'John', active: true, isPublisher: false, audio: true }
  }
};

it('displays the participants in the room', async () => {
  const { getByText } = renderWithRedux(<Participants />, { initialState });
  const jane = await screen.findByText('Jane');
});
