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
    <button key={label} onClick={fn}>
      {label}
    </button>
  );
}

function Notification({ notification }) {
  const dispatch = useDispatch();
  const { id, text } = notification;

  return (
    <div role="alertdialog">
      <p>{text}</p>

      <div>
        { notification.actions.map(({label, toDispatch}) => (
          notificationAction(label, () => dispatch(actions.dispatchAction(id, toDispatch)))
        ))}
        { notificationAction("Close", () => dispatch(actions.close(id))) }
      </div>
    </div>
  );
}

export default Notification;
