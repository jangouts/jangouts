/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhVideoButton', jhVideoButton);

  jhVideoButton.$inject = ['RoomService'];

  function jhVideoButton(RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/buttons/jh-video-button.html',
      scope: {
        feed: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhVideoButtonCtrl
    };

    function JhVideoButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.toggle = toggle;
      vm.showsEnable =showsEnable;
      vm.showsDisable = showsDisable;

      function toggle() {
        RoomService.toggleChannel("video", vm.feed);
      }

      function showsEnable() {
        return (vm.feed && vm.feed.isPublisher && !vm.feed.getVideoEnabled());
      }

      function showsDisable() {
        return (vm.feed && vm.feed.isPublisher && vm.feed.getVideoEnabled());
      }
    }
  }
})();
