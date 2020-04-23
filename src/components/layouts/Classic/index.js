/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';

import Header from '../../Header';
import Speaker from '../../Speaker';
import Participants from '../../Participants';
import Chat from '../../Chat';

function Classic() {
  return (
    <div className="w-screen h-screen bg-primary-dark border-b-8 border-primary-dark">
      <div className="h-full padding-b-4 flex flex-col bg-gray-100">
        <div className="px-4 py-1 text-white font-bold border-b-4 border-secondary bg-primary-dark ">
          <Header />
        </div>
        <div className="flex-1 pt-2 overflow-hidden grid gap-2 grid-rows-6 grid-cols-2 sm:grid-flow-col">
          <div className="flex justify-center overflow-hidden row-span-2 col-span-2 sm:row-span-3 sm:col-span-1">
            <Speaker />
          </div>
          <div className="overflow-y-auto row-span-2 col-span-2 border-t sm:row-span-3 sm:col-span-1 sm:border-t-0">
            <Participants />
          </div>
          <div className="overflow-y-auto row-span-2 col-span-2 border-t sm:row-span-6 sm:border-t-0 sm:border-l-2">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Classic;
