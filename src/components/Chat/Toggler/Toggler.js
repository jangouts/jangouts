/**
 * Copyright (c) [2022] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { MessageSquare } from 'react-feather';
import { classNames } from '../../../utils/common';

function Toggler({}) {
  return (
    <button
      title={true ? 'Hide chat' : 'Show chat'}
      onClick={true}>
      <MessageSquare
        className={classNames(
          'p-1 rounded',
          true ? 'bg-white text-primary' : 'bg-primary-dark hover:bg-primary text-white'
        )}
      />
    </button>
  );
}

export default Toggler;
