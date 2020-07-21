/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import janusApi from '../../janus-api';
import { fetch as fetchConfig } from '../../utils/config';
import { createRoomEventsHandler } from '../../utils/room-events-handler';

const LOAD_CONFIG = 'jangouts/config/LOAD';

export const load = function() {
  return function(dispatch) {
    fetchConfig().then(function(config) {
      janusApi.setup(config, createRoomEventsHandler(dispatch));
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

const actionCreators = {
  load
};

const actionTypes = {
  LOAD_CONFIG
};

const initialState = {};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG: {
      return action.payload;
    }
    default:
      return state;
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
