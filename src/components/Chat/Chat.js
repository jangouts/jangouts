/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';

function Chat() {
  return (
    <div className="relative h-full pb-12">
      <MessagesList />
      <MessageForm />
    </div>
  );
}

export default Chat;
