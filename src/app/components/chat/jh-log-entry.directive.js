/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhLogEntry', jhLogEntryDirective);

  function jhLogEntryDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/chat/jh-log-entry.html',
      scope: {
        message: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhLogEntryCtrl
    };

    function JhLogEntryCtrl() {
      var vm = this;
      vm.text = vm.message.text();
    }
  }
})();
