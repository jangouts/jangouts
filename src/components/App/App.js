import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from '../Login';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Login} />
    </BrowserRouter>
  );
}

export default App;
