/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhScreenShareSubButton', jhScreenShareSubButtonDirective);

  jhScreenShareSubButtonDirective.$inject = ['ScreenShareService', 'RoomService', 'RequestService'];

  function jhScreenShareSubButtonDirective(ScreenShareService, RoomService, RequestService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/screen-share/jh-screen-share-sub-button.html',
      scope: {
        source: '=',
        icon: '=',
        label: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhScreenShareSubButtonCtrl
    };

    function JhScreenShareSubButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.click = click;
      vm.enabled = enabled;
      vm.title = title;

      function click() {
        if (vm.enabled()) {
          RoomService.publishScreen(vm.source);
        }
      }

      function enabled() {
        return (RequestService.usingSSL() && !ScreenShareService.getInProgress());
      }

      function title() {
        if (vm.enabled()) {
          //return "Share a window/desktop";
          return vm.label;
        } else {
          if (ScreenShareService.getInProgress()) {
            return "Wait while the screen is shared";
          } else {
            return "Screen sharing disabled (no SSL?)";
          }
        }
      }
    }
  }
})();
