import React from 'react';
import ReactDOM from 'react-dom';
import Room from './Room';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Room />, div);
  ReactDOM.unmountComponentAtNode(div);
});
