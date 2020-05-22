/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import Notification from './Notification';

import './Notifications.css';

function Notifications({ className }) {
  const notifications = useSelector((state) => state.notifications);
  return (
    <div className={className}>
      {notifications.map((n, i) => (
        <Notification key={i} notification={n} />
      ))}
    </div>
  );
}

export default Notifications;
