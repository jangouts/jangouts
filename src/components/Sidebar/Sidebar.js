import React from 'react';
import Button from '../Button';

import './Sidebar.css';

function Sidebar() {
  return (
    <div className="Sidebar">
      <Button className="red">·</Button>
      <Button>·</Button>
      <Button>·</Button>
    </div>
  );
}

export default Sidebar;
