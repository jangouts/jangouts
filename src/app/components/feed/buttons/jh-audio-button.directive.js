/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhAudioButton', jhAudioButton);

  jhAudioButton.$inject = ['RoomService'];

  function jhAudioButton(RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/buttons/jh-audio-button.html',
      scope: {
        feed: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhAudioButtonCtrl
    };

    function JhAudioButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.toggle = toggle;
      vm.showsEnable = showsEnable;
      vm.showsDisable = showsDisable;
      vm.showsAudioOff = showsAudioOff;

      function toggle() {
        RoomService.toggleChannel("audio", vm.feed);
      }

      function showsEnable() {
        return (vm.feed.isPublisher && !vm.feed.getAudioEnabled());
      }

      function showsDisable() {
        return (!vm.feed.isIgnored && vm.feed.getAudioEnabled());
      }

      function showsAudioOff() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored && !vm.feed.getAudioEnabled());
      }
    }
  }
})();
