/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MuteButton from './MuteButton';
import { renderWithRedux } from '../../setupTests';

const initialState = {
  participants: {
    1: { isPublisher: true, audio: true },
    2: { isPublisher: true, audio: false },
    3: { isPublisher: false, audio: true },
    4: { isPublisher: false, audio: false }
  }
};

describe('when given participant is the publisher', () => {
  describe('and audio is true', () => {
    it('renders it enabled', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={1} />, { initialState });
      const button = getByText('Mute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Mute"', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={1} />, { initialState });
      const button = getByText('Mute');

      expect(button).toBeInTheDocument();
    });
  });

  describe('and audio is false', () => {
    it('renders it enabled', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={2} />, { initialState });
      const button = getByText('Unmute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Unmute"', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={2} />, { initialState });
      const button = getByText('Unmute');

      expect(button).toBeInTheDocument();
    });
  });
});

describe('when given participant is not the publisher', () => {
  describe('and audio is true', () => {
    it('renders it enabled', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={3} />, { initialState });
      const button = getByText('Mute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Mute"', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={3} />, { initialState });
      const button = getByText('Mute');

      expect(button).toBeInTheDocument();
    });
  });

  describe('and audio is false', () => {
    it('renders as disabled', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={4} />, { initialState });
      const button = getByText('Unmute');

      expect(button.disabled).toBe(true);
    });

    it('renders "Unmute"', () => {
      const { getByText } = renderWithRedux(<MuteButton participantId={4} />, { initialState });
      const button = getByText('Unmute');

      expect(button).toBeInTheDocument();
    });
  });
});
