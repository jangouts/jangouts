import React from 'react';

import './Button.css';

function Button(props) {
  const className = `Button ${props.className}`;

  return (
    <div className={className}>
      <div>{props.children}</div>
    </div>
  );
}

export default Button;
