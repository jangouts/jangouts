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
    const styleX = chatPosition === START ? "left-1/2 md:left-full" : "left-1/2 md:left-0";
    const styleY = chatPosition === START ? "sm:bottom-0 md:bottom-1/2" : "bottom-full md:bottom-1/2";
    const commonIconStyle = "relative rounded-full bg-gray-100 text-gray-300 hover:text-primary-dark";

    return (
      <button title="Change chat position" className={`absolute sm:-rotate-90 p-0 ${styleX} ${styleY}`} onClick={swapPosition}>
        { chatPosition === START
          ? <ArrowDown style={{width: "16px", height: "16px" }} className={`${commonIconStyle} bottom-[2px] sm:top-[-8px] p-0 border-b-2`} />
          : <ArrowUp style={{width: "16px", height: "16px" }} className={`${commonIconStyle} top-[8px] sm:top-[-8px] p-0 border-t-2`} />
        }
      </button>
    );
  };

  return (
    <div className="w-screen h-screen bg-primary-dark border-b-8 border-primary-dark">
      <div className="h-full padding-b-4 flex flex-col bg-gray-100">
        <div className="px-4 pt-2 pb-1 text-white font-bold border-b-4 border-secondary bg-primary-dark ">
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
              !showChat && 'row-span-4 sm:row-span-6',
            )}>
            <Participants />
          </div>
          {showChat && (
            <div className={classNames(
              "relative transition-all row-span-2 col-span-2 sm:row-span-6 sm:border-t-0 sm:border-b-0 sm:border-l-2",
              chatPosition === START && "row-start-1 !sm:col-start-1 sm:col-end-2 border-b pb-2 sm:border-r-2",
              chatPosition === END && "!sm:col-start-2 lg:col-start-3 border-t pt-2 sm:border-l-2",
            )}>
              <Chat />
              <SwapButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classic;
