import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';

import Logo from './Logo';

describe('Logo component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Logo />, div);
    ReactDOM.unmountComponentAtNode(div);
  });


  describe('props', () =>{
    it('uses "100%" as width when not given', ()=> {
      const testRenderer = TestRenderer.create(<Logo />);
      const props = testRenderer.toJSON().props;

      expect(props.width).toBe("100%");
    })

    it('uses the given width', () => {
      const testRenderer = TestRenderer.create(<Logo width={"300"} />);
      const props = testRenderer.toJSON().props;

      expect(props.width).toBe("300");
    });

    it('uses "Jangouts logo" as alt when not given', ()=> {
      const testRenderer = TestRenderer.create(<Logo />);
      const props = testRenderer.toJSON().props;

      expect(props.alt).toBe("Jangouts logo");
    })

    it('uses the given alt', () => {
      const testRenderer = TestRenderer.create(<Logo alt={"The logo"} />);
      const props = testRenderer.toJSON().props;

      expect(props.alt).toBe("The logo");
    });
  });
});
