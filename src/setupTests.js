/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom'
import 'mutationobserver-shim';

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import reducers from './state/ducks';

// Mock `scrollTo` function, used in the Chat component, since it isn't defined
// in jsdom yet. Related to https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollTo = jest.fn();

// Mock the browser's observer used to resize the participant thumbnails
class MockObserver {
  observe() { jest.fn() }
  disconnect() { jest.fn() }
}
window.ResizeObserver = MockObserver;

export function renderWithRedux(
  ui,
  { initialState, store = createStore(reducers, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}
