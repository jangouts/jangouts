/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ToggleFullscreen from './ToggleFullscreen';
import { render } from '@testing-library/react';

const ref = {
  current: {
    requestFullscreen: jest.fn(),
    addEventListener: jest.fn()
  }
};

it('renders without crashing', () => {
  render(<ToggleFullscreen elementRef={ref} />);
});
