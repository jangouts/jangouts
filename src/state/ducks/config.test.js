/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import reducer, { actionTypes as types, actionCreators as actions } from './config';

describe('reducer', () => {
  const initialState = {};

  it('does not handle unknown action', () => {
    const action = { type: 'UNKNOWN', payload: {} };

    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('handles LOAD_CONFIG', () => {
    const action = { type: types.LOAD_CONFIG, payload: { thumbnailMode: false } };

    expect(reducer(initialState, action)).toEqual(action.payload);
  });

  it('handles TOGGLE_THUMBNAIL_MODE', () => {
    const action = {
      type: types.TOGGLE_THUMBNAIL_MODE,
      payload: { thumbnailMode: true }
    };

    expect(reducer(initialState, action)).toEqual({ thumbnailMode: true });
  });
});

describe('action creators', () => {
  describe.skip('#load', () => {});

  describe.skip('#toggleThumbnailMode', () => {});
});
