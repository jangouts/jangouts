/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowDown, ArrowUp } from 'react-feather';

import Header from '../../Header';
import Speaker from '../../Speaker';
import Participants from '../../Participants';
import Chat from '../../Chat';
import ChatToggler from '../../Chat/Toggler';
import ParticipantActions from '../../Participant/HeaderActions';
import Notifications from '../../Notifications';

const START = "start";
const END = "end";

function Classic() {
  const { settings } = useSelector((state) => state.room);
  const showChat = settings.chatOpen;
  const [chatPosition, setChatPosition] = useState(END);

  const swapPosition = () => {
    setChatPosition(chatPosition === END ? START : END);
  };

  const SwapButton = () => {
    return (
      <button
        title="Toggle chat position"
        className="chat-position-toggler"
        data-chat-position={chatPosition}
        onClick={swapPosition}
      >
        { chatPosition === START ? <ArrowDown /> : <ArrowUp /> }
      </button>
    );
  };

  const ChatColumn = () => {
    if (!showChat) return null;

    return (
      <div className="chat-wrapper" data-chat-position={chatPosition}>
        <Chat />
        <SwapButton />
      </div>
    );
  };

  return (
    <div className="full-viewport">
      <div className="header-wrapper">
        <Header>
          <ParticipantActions />
          <ChatToggler />
        </Header>
      </div>
      <div className="content-wrapper">
        <ChatColumn />
        <Notifications className="notifications-wrapper"
        />
        <div className="speaker-wrapper">
          <Speaker />
        </div>
        <Participants />
      </div>
      <div className="footer">
        Powered by <a target="_blank" rel="noreferrer" href="https://github.com/jangouts/jangouts" className="underline">Jangouts</a>
      </div>
    </div>
  );
}

export default Classic;
