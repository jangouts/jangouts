/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhMainFeedInfo', jhMainFeedInfoDirective);

  jhMainFeedInfoDirective.$inject = ['FeedsService'];

  function jhMainFeedInfoDirective(FeedsService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/jh-main-feed-info.html',
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: jhMainFeedInfoCtrl
    };

    function jhMainFeedInfoCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.name = name;

      function name() {
        return FeedsService.findMain().display;
      }
    }
  }
})();
