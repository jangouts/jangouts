/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Participants from './Participants';
import { renderWithRedux } from '../../setupTests';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');
Janus.attachMediaStream = jest.fn();

const initialState = {
  participants: {
    1: { id: 1, display: 'Jane', active: true, isPublisher: true, audio: true }
  }
};

it('renders without crashing', () => {
  const { getByText } = renderWithRedux(<Participants />, { initialState });
  expect(getByText('Jane')).toBeInTheDocument();
});
