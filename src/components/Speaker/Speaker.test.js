/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Speaker from './Speaker';
import { renderWithRedux } from '../../setupTests';
import janusApi from '../../janus-api';
import { Janus } from '../../vendor/janus';

jest.mock('../../janus-api');

janusApi.getFeedStream = jest.fn();
Janus.attachMediaStream = jest.fn();

it('renders without crashing', () => {
  renderWithRedux(<Speaker />);
});
