/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';

import store from '../../state/store';
import history from '../../utils/history';

import Login from '../Login';
import Room from '../Room';
import AppStarter from '../AppStarter';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <AppStarter>
        <HashRouter history={history}>
          <Route exact path="/" component={Login} />
          <Route path="/room/:roomId" component={Room} />
        </HashRouter>
      </AppStarter>
    </Provider>
  );
}

export default App;
