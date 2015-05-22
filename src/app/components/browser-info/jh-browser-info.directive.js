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

  jhBrowserInfoDirective.$inject = ['$modal'];

  function jhBrowserInfoDirective($modal) {
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
        $modal.open({
          animation: true,
          templateUrl: 'app/components/browser-info/browser-info.html',
          controller: 'BrowserInfoCtrl',
          controllerAs: 'vm'
        });
      }
    }
  }
})();
