/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

Notifier.$inject = ['notifications'];

function Notifier(notifications) {
  this.info = info;

  function info(text) {
    notifications.info("Information", text, {
      duration: 5000,
      attachTo: $('#videochat-body'),
    });
  }
}

export default Notifier;
