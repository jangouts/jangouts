/**
 * Copyright (c) [2015-2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Redirect } from 'react-router';
import { actionCreators as roomActions } from '../../state/ducks/room';

import { Classic as RoomLayout } from '../layouts';

const randomUsername = () => `user_${Math.floor(Math.random() * 1000)}`;

function Room({ location }) {
  const room = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    if (room.loggedIn) return;
    const params = new URLSearchParams(location.search);
    const username = params.get('user') || randomUsername();
    // TODO: get username from local storage
    dispatch(roomActions.login(username, roomId));
  }, []);

  if (room.error) {
    return <Redirect to="/" />;
  }

  return <RoomLayout />;
}

export default Room;
