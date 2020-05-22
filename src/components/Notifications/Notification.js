/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as actions } from '../../state/ducks/notifications';

import './Notification.css';

function Notification({ notification }) {
  const dispatch = useDispatch();
  const { id, text } = notification;

  return (
    <div
      role="alertdialog"
      className="w-1/3 mb-2 p-3 text-sm text-gray-700 border-b-2 border-secondary bg-white shadow-lg"
    >
      {text}

      <div className="mt-2">
        <button className="text-blue-600 font-bold mr-2" onClick={() => dispatch(actions.close(id))}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default Notification;
