/**
 * Copyright (c) [2015-2020] SUSE Linux
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('when video is available', () => {
  const fakeParticipant = { id: 1, display: 'Jane', video: true };

  it('renders the participant video', () => {
    const { getByTestId } = renderWithRedux(<Participant {...fakeParticipant} />);

    expect(getByTestId('participant-video')).toBeInTheDocument();
  });

  it('attaches media stream', () => {
    renderWithRedux(<Participant {...fakeParticipant} />);

    expect(Janus.attachMediaStream).toHaveBeenCalledWith(expect.anything(), {
      id: 'someid',
      active: true
    });
  });
});

describe('when video is not available', () => {
  const fakeParticipant = { id: 1, display: 'Jane', video: false };

  it('renders the participant thumbnail', () => {
    const { getByTestId } = renderWithRedux(<Participant {...fakeParticipant} />);

    expect(getByTestId('participant-thumbnail')).toBeInTheDocument();
  });

  it('does not attach the media stream', () => {
    renderWithRedux(<Participant {...fakeParticipant} />);

    expect(Janus.attachMediaStream).not.toHaveBeenCalled();
  });
});
