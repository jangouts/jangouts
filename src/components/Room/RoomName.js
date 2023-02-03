/**
 * Copyright (c) [2023] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import janusApi from '../../janus-api';

function RoomName({className}) {
  const roomId = useSelector((state) => state.room).roomId;
  const [name, setName] = useState("");

  useEffect(() => {
    janusApi.getRooms().then((rooms) => {
      const room = rooms.find((r) => r.id === roomId);
      setName(room ? room.description : "");
    });
  }, []);

  return (<span className={className}>{name}</span>);
}

export default RoomName;
