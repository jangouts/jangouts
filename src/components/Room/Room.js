import React from 'react';
import {WidthProvider, Responsive} from 'react-grid-layout';

import Header from '../Header';
import Sidebar from '../Sidebar';
import Speaker from '../Speaker';
import Participants from '../Participants';
import Chat from '../Chat';

import './Room.css';
import '../../assets/react-grid-layout.css';
import '../../assets/react-resizable.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Room() {
  const layouts = {};
  return (
    <div className="Room">
      <Sidebar />
      <Header />
      <ResponsiveGridLayout className="layout" layouts={layouts}>
        <div
          key="speaker"
          data-grid={{w: 6, h: 3, x: 0, y: 0, minW: 2, minH: 3}}>
          <Speaker />
        </div>
        <div
          key="participants"
          data-grid={{w: 4, h: 3, x: 6, y: 0, minW: 2, minH: 3}}>
          <Participants />
        </div>
        <div key="chat" data-grid={{w: 12, h: 3, x: 0, y: 3, minW: 2, minH: 3}}>
          <Chat />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}

export default Room;
