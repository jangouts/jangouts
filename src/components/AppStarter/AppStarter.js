/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as configActions } from '../../state/ducks/config';
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
    return props.children;
  }
}

export default AppStarter;
