/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { renderWithRedux } from '../../setupTests';
import Sidebar from './Sidebar';

it('renders without crashing', () => {
  renderWithRedux(<Sidebar />);
});
