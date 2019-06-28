import React from 'react';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';
import './Chat.css';

function Chat() {
  return (
    <div className="Chat">
      <MessagesList />
      <MessageForm />
    </div>
  );
}

export default Chat;
