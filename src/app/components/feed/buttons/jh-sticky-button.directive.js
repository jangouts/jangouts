/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhStickyButton', jhStickyButton);

  function jhStickyButton() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/buttons/jh-sticky-button.html',
      scope: {
        feed: '=',
        clickFn: '&',
        highlighted: '=',
        sticky: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhStickyButtonCtrl
    };

    function JhStickyButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.click = click;
      vm.showsEnable = showsEnable;
      vm.showsDisable = showsDisable;

      function click() {
        vm.clickFn();
      }

      function showsEnable() {
        return (!vm.sticky && !vm.feed.isIgnored);
      }

      function showsDisable() {
        return vm.sticky;
      }
    }
  }
})();
