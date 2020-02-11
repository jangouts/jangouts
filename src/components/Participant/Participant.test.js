/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Participant from './Participant';
import { renderWithRedux } from '../../setupTests';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');

Janus.attachMediaStream = jest.fn();

const initialState = {
  participants: {
    1: { display: 'Jane', isPublisher: true, audio: true, active: true }
  }
};

it('renders without crashing', () => {
  renderWithRedux(<Participant id={1} display="User" />, { initialState });
  expect(Janus.attachMediaStream).toHaveBeenCalledWith(expect.anything(), {
    id: 'someid',
    active: true
  });
});
