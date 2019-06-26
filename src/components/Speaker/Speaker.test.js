import React from 'react';
import ReactDOM from 'react-dom';
import Speaker from './Speaker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Speaker />, div);
  ReactDOM.unmountComponentAtNode(div);
});
