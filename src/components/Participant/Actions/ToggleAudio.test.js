/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import ToggleAudio from './ToggleAudio';
import { renderWithRedux } from '../../../setupTests';
import { screen } from '@testing-library/react';

const initialState = {
  participants: {
    1: { display: 'Jane', isPublisher: true, audio: true },
    2: { display: 'John', isPublisher: true, audio: false },
    3: { display: 'Jane', isPublisher: false, audio: true },
    4: { display: 'John', isPublisher: false, audio: false }
  }
};

describe('when given participant is the publisher', () => {
  describe('and audio is true', () => {
    it('renders it enabled', () => {
      renderWithRedux(<ToggleAudio participantId={1} />, { initialState });
      const button = screen.getByTitle('Mute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Mute"', () => {
      renderWithRedux(<ToggleAudio participantId={1} />, { initialState });
      const button = screen.getByTitle('Mute');

      expect(button).toBeInTheDocument();
    });
  });

  describe('and audio is false', () => {
    it('renders it enabled', () => {
      renderWithRedux(<ToggleAudio participantId={2} />, { initialState });
      const button = screen.getByTitle('Unmute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Unmute"', () => {
      renderWithRedux(<ToggleAudio participantId={2} />, { initialState });
      const button = screen.getByTitle('Unmute');

      expect(button).toBeInTheDocument();
    });
  });
});

describe('when given participant is not the publisher', () => {
  describe('and audio is true', () => {
    it('renders it enabled', () => {
      renderWithRedux(<ToggleAudio participantId={3} />, { initialState });
      const button = screen.getByTitle('Mute');

      expect(button.disabled).not.toBe(true);
    });

    it('renders "Mute"', () => {
      renderWithRedux(<ToggleAudio participantId={3} />, { initialState });
      const button = screen.getByTitle('Mute');

      expect(button).toBeInTheDocument();
    });
  });

  describe('and audio is false', () => {
    it('renders as disabled', () => {
      renderWithRedux(<ToggleAudio participantId={4} />, { initialState });
      const button = screen.getByTitle('John is muted');

      expect(button.disabled).toBe(true);
    });

    it('renders "username is muted"', () => {
      renderWithRedux(<ToggleAudio participantId={4} />, { initialState });
      const button = screen.getByTitle('John is muted');

      expect(button).toBeInTheDocument();
    });
  });
});
