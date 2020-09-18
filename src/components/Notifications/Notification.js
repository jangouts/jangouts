/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as actions } from '../../state/ducks/notifications';

function notificationAction(label, fn) {
  return (
    <button key={label}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={fn}>
      {label}
    </button>
  );
}

function Notification({ notification }) {
  const dispatch = useDispatch();
  const { id, text } = notification;

  return (
    <div
      role="alertdialog"
      className="w-1/3 xl:w-1/4 mb-2 p-3 text-sm text-gray-700 border-b-2 border-secondary bg-white shadow-lg"
    >
      <p className="text-gray-700">{text}</p>

      <div className="mt-2 flex justify-around">
        { notification.actions.map(({label, toDispatch}) => (
          notificationAction(label, () => dispatch(actions.dispatchAction(id, toDispatch)))
        ))}
        { notificationAction("Close", () => dispatch(actions.close(id))) }
      </div>
    </div>
  );
}

export default Notification;
