/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';

import store from '../../state/store';

import Login from '../Login';
import Room from '../Room';
import AppStarter from '../AppStarter';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <AppStarter>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </HashRouter>
      </AppStarter>
    </Provider>
  );
}

export default App;
