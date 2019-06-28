import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import store from '../../state/store';
import janusApi from '../../janus-api';
import { addEventsHandlers } from './events-handler';

import Login from '../Login';
import Room from '../Room';

import './App.css';

janusApi.setup();
const eventsHandler = addEventsHandlers(
  janusApi.getEventsSubject(),
  store.dispatch
);

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
