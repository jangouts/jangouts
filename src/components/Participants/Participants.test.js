/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Participants from './Participants';
import { renderWithRedux } from '../../setupTests';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');
Janus.attachMediaStream = jest.fn();

it('renders without crashing', () => {
  const participants = [{ id: 1, display: 'Jane' }];
  const { getByText } = renderWithRedux(<Participants />, { initialState: { participants } });
  expect(getByText('Jane')).toBeInTheDocument();
});
