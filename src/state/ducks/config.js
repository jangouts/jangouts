/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import { fetch as fetchConfig } from '../../utils/config';
import { createEventsHandler } from '../../utils/events-handler';

const LOAD_CONFIG = 'jangouts/config/LOAD';
const TOGGLE_THUMBNAIL_MODE = 'jangouts/config/TOGGLE_THUMBNAIL_MODE';

export const load = function() {
  return function(dispatch) {
    fetchConfig().then(function(config) {
      janusApi.setup(config, createEventsHandler(dispatch));
      dispatch(configLoaded(config));
    });
  };
};

const configLoaded = function(config) {
  return {
    type: LOAD_CONFIG,
    meta: { request: false },
    payload: config
  };
};

const toggleThumbnailMode = () => {
  return function(dispatch, getState) {
    let { thumbnailMode } = getState().config;

    thumbnailMode ? janusApi.disableThumbnailMode() : janusApi.enableThumbnailMode();

    dispatch({ type: TOGGLE_THUMBNAIL_MODE, payload: { thumbnailMode: !thumbnailMode } });
  };
};

const actionCreators = {
  load,
  toggleThumbnailMode
};

const actionTypes = {
  LOAD_CONFIG,
  TOGGLE_THUMBNAIL_MODE
};

const initialState = {};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG: {
      return action.payload;
    }
    case TOGGLE_THUMBNAIL_MODE: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
