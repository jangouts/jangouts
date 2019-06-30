import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';

import LoginForm from './LoginForm';

describe('LoginForm component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginForm />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has an input to enter the username', () => {
    const testRenderer = TestRenderer.create(<LoginForm />);
    const inputs = testRenderer.root.findAllByType('input');

    expect(inputs.map((input) => input.props.name)).toContain('username');
  });

  it('has a selector to choose the room', () => {
    const testRenderer = TestRenderer.create(<LoginForm />);
    const selector = testRenderer.root.findByType('select');

    expect(selector.props.name).toBe('room');
  });
});
