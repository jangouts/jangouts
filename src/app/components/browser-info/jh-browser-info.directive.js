/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhBrowserInfo', jhBrowserInfoDirective);

  jhBrowserInfoDirective.$inject = ['$uibModal'];

  function jhBrowserInfoDirective($uibModal) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/browser-info/jh-browser-info.html',
      scope: true,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhBrowserInfoCtrl
    };

    function JhBrowserInfoCtrl() {
      /* jshint: validthis */
      var vm = this;

      vm.showHelp = showHelp;

      function showHelp() {
        $uibModal.open({
          animation: true,
          templateUrl: 'app/components/browser-info/browser-info.html',
          controller: 'BrowserInfoCtrl',
          controllerAs: 'vm'
        });
      }
    }
  }
})();
