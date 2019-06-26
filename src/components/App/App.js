import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Login from '../Login';
import Room from '../Room';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <Route path="/room" component={Room} />
    </BrowserRouter>
  );
}

export default App;
