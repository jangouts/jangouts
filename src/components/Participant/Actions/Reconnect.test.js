/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import Reconnect from './Reconnect';
import { renderWithRedux } from '../../../setupTests';

const initialState = {
  participants: {
    1: { isPublisher: true },
    2: { isPublisher: false }
  }
};

it('renders without crashing', () => {
  renderWithRedux(<Reconnect participantId={2} />, initialState);
});
