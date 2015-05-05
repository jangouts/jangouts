(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('LogEntry', LogEntryFactory);

  function LogEntryFactory() {
    return function(type, content) {
      this.type = type;
      this.timestamp = new Date();
      this.content = content || {};
    };
  }
})();
