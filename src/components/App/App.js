/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';

import store from '../../state/store';
import janusApi from '../../janus-api';
import { addEventsHandlers } from './events-handler';
import history from '../../utils/history';

import Login from '../Login';
import Room from '../Room';

import './App.css';

janusApi.setup();
const eventsHandler = addEventsHandlers(janusApi.getEventsSubject(), store.dispatch);

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route exact path="/" component={Login} />
        <Route path="/room/:roomId" component={Room} />
      </Router>
    </Provider>
  );
}

export default App;
