/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This module takes care of displaying notifications to the user.
 *
 * @see notifications
 */
import cogoToast from 'cogo-toast';

import { SEVERITY_INFO, SEVERITY_WARN, SEVERITY_ERROR } from './notifications';

const DEFAULT_OPTIONS = {
  hideAfter: 5
};

const notifyFns = {
  [SEVERITY_INFO]: cogoToast.info,
  [SEVERITY_WARN]: cogoToast.warn,
  [SEVERITY_ERROR]: cogoToast.error
};

/**
 * Shows a notification
 *
 * @param {object} notification - notification to display
 * @param {object} options - notification options
 * @param {number} options.hideAfter - notification time out
 */
const notify = (notification, options) => {
  const { severity, text } = notification;
  const notifyFn = notifyFns[severity];
  const notifyOptions = { ...DEFAULT_OPTIONS, ...options };

  const { hide } = notifyFn(text, {
    ...notifyOptions,
    onClick: () => {
      hide();
    }
  });
};

export default {
  notify
};
