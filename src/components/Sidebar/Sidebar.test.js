import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sidebar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
