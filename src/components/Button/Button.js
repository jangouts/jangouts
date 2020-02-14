/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';

import './Button.css';

// TODO: Button seems no longer necessary. Use simpler approach
function Button({ action, children, className }) {
  const dispatch = useDispatch();
  const cssClassName = `Button ${className}`;

  return (
    <div className={cssClassName}>
      {action ? <a onClick={() => dispatch(action())}>{children}</a> : children}
    </div>
  );
}

export default Button;
