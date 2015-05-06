/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('LogService', LogService);

  function LogService() {
    this.entries = [];

    this.add = add;
    this.allEntries = allEntries;

    function add(entry) {
      this.entries.push(entry);
    }

    function allEntries() {
      return this.entries;
    }
  }
}());
