/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhResizeModeButton', jhResizeModeButton);

  function jhResizeModeButton() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/buttons/jh-resize-mode-button.html',
      scope: {
        toggleFn: '&',
        resetFn: '&',
        resizeModeOn: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhResizeModeButtonCtrl
    };

    function JhResizeModeButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.toggle = toggle;
      vm.reset = reset;
      vm.showsReset = showsReset;
      vm.title = title;

      function toggle() {
        vm.toggleFn();
      }

      function reset() {
        vm.resetFn();
      }

      function showsReset() {
        return vm.resizeModeOn;
      }

      function title() {
        return vm.resizeModeOn ? "Save layout" : "Change screen layout";
      }
    }
  }
})();
