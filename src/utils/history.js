/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE.txt file for details.
 */

/**
 * Creates and export the browser history object needed by Router. This is
 * necessary to simplify the users redirection, e.g., when leaving a room
 *
 * See https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/redux.md
 */
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export default history;
