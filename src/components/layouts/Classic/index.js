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

import { classNames } from '../../../utils/common';

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
    <div className="w-screen h-screen bg-primary-dark border-b-1 border-primary-dark">
      <div className="h-full padding-b-4 flex flex-col bg-gray-100">
        <div className="px-4 pt-2 pb-1 text-white font-bold border-b-4 border-secondary bg-primary-dark">
          <Header>
            <ParticipantActions />
            <ChatToggler />
          </Header>
        </div>
        <div className="flex-1 transition-all pt-2 overflow-hidden grid gap-2 grid-rows-6 grid-cols-2 lg:grid-cols-3 sm:grid-flow-col">
          <Notifications
            className="w-full absolute z-50 flex flex-col items-center"
          />
          <div
            className={classNames(
              'flex p-1 justify-center overflow-hidden row-span-2 col-span-2 sm:row-span-3 sm:col-span-1 lg:col-span-2',
              !showChat && 'sm:row-span-6'
            )}>
            <Speaker />
          </div>
          <div
            className={classNames(
              'overflow-y-auto row-span-2 col-span-2 border-t sm:row-span-3 sm:col-span-1 lg:col-span-2 sm:border-t-0',
              !showChat && 'row-span-4 sm:row-span-6'
            )}>
            <Participants />
          </div>
          <ChatColumn />
        </div>
        <div className="bg-primary-dark border-t-2 border-secondary text-xs text-white text-center py-1">
          Powered by <a target="_blank" href="https://github.com/jangouts/jangouts" className="underline">Jangouts</a>
        </div>
      </div>
    </div>
  );
}

export default Classic;
