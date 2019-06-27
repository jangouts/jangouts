import { createStore, combineReducers } from 'redux';

export default createStore(
  combineReducers({}),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
