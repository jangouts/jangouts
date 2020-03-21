/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';

import './Button.css';

// TODO: Button seems no longer necessary. Use simpler approach
function Button({ action, title, className, children }) {
  const dispatch = useDispatch();
  const cssClassName = `Button ${className}`;

  return (
    <div className={cssClassName}>
      {action ? (
        <a title={title} onClick={() => dispatch(action())}>
          {children}
        </a>
      ) : (
        children
      )}
    </div>
  );
}

export default Button;
