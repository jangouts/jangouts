/**
 * Copyright (c) [2015-2019] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Redirect } from 'react-router';
import { WidthProvider, Responsive } from 'react-grid-layout';

import { actionCreators as roomActions } from '../../state/ducks/room';

import Header from '../Header';
import Sidebar from '../Sidebar';
import Speaker from '../Speaker';
import Participants from '../Participants';
import Chat from '../Chat';

import './Room.css';
import '../../assets/react-grid-layout.css';
import '../../assets/react-resizable.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const randomUsername = () => `user_${Math.floor(Math.random() * 1000)}`;

function Room({ location }) {
  const room = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    if (room.logedIn) return;
    const params = new URLSearchParams(location.search);
    const username = params.get('user') || randomUsername();
    // TODO: get username from local storage
    dispatch(roomActions.login(username, roomId));
  }, []);

  if (room.error) {
    return <Redirect to="/" />;
  }

  const layouts = {};
  return (
    <div className="Room">
      <Sidebar />
      <Header />
      <ResponsiveGridLayout className="layout" layouts={layouts}>
        <div key="speaker" data-grid={{ w: 6, h: 3, x: 0, y: 0, minW: 2, minH: 3 }}>
          <Speaker />
        </div>
        <div key="participants" data-grid={{ w: 4, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
          <Participants />
        </div>
        <div key="chat" data-grid={{ w: 12, h: 3, x: 0, y: 3, minW: 2, minH: 3 }}>
          <Chat />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default Room;
