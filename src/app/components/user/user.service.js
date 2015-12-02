/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('UserService', UserService);

  function UserService() {
    this.user = null;

    this.getUser = function() {
      return this.user;
    };

    this.signin = function(username) {
      this.user = { username: username };
    };
  }
})();
