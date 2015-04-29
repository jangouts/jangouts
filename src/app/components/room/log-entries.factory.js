(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('LogEntry', ['$timeout', LogEntryFactory]);

  function LogEntryFactory($timeout) {
    return function(type, content) {

      this.type = type;
      this.timestamp = new Date();
      this.content = content || {};
    };
  }
})();
