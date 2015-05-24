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

  LogService.$inject = ['$timeout'];

  function LogService($timeout) {
    this.entries = [];

    this.add = add;
    this.allEntries = allEntries;

    function add(entry) {
      var that = this;

      $timeout(function () {
        that.entries.push(entry);
      });
    }

    function allEntries() {
      return this.entries;
    }
  }
}());
