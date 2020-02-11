/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MuteButton from './MuteButton';
import { renderWithRedux } from '../../setupTests';

it('renders without crashing', () => {
  const { getByText } = renderWithRedux(<MuteButton id={1} audio={true} isPublisher={true} />);
  const button = getByText('Mute');
  expect(button).toBeInTheDocument();
});
