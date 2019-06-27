import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import store from '../../state/store';

import Login from '../Login';
import Room from '../Room';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route path="/room" component={Room} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
