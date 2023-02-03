/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { useSelector } from 'react-redux';

import Header from '../../Header';
import Speaker from '../../Speaker';
import Participants from '../../Participants';
import Chat from '../../Chat';
import ChatToggler from '../../Chat/Toggler';
import Notifications from '../../Notifications';

import { classNames } from '../../../utils/common';

function Classic() {
  const { settings } = useSelector((state) => state.room);
  const showChat = settings.chatOpen;

  return (
    <div className="w-screen h-screen bg-primary-dark border-b-8 border-primary-dark">
      <div className="h-full padding-b-4 flex flex-col bg-gray-100">
        <div className="px-4 pt-2 pb-1 text-white font-bold border-b-4 border-secondary bg-primary-dark ">
          <Header>
            <ChatToggler />
          </Header>
        </div>
        <div className="flex-1 pt-2 overflow-hidden grid gap-2 grid-rows-6 grid-cols-2 lg:grid-cols-3 sm:grid-flow-col">
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
          {showChat && (
            <div className="overflow-y-auto row-span-2 col-span-2 border-t sm:row-span-6 sm:border-t-0 sm:border-l-2">
              <Chat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classic;
