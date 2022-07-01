/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as configActions } from '../../state/ducks/config';
import { actionCreators as roomActions } from '../../state/ducks/room';
import Logo from '../Logo';

import './AppStarter.css';

/**
 * This component makes sure that the janusApi is properly initialized.
 */
function AppStarter(props) {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);

  useEffect(() => {
    dispatch(configActions.load());
    dispatch(roomActions.loadSettings());
  }, []);

  if (Object.entries(config).length === 0) {
    return (
      <div className="AppStarter">
        <div className="content">
          <Logo />
        </div>
      </div>
    );
  } else {
    return <div className="theme-classic">{props.children}</div>;
  }
}

export default AppStarter;
