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
