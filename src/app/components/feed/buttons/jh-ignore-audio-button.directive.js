/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhIgnoreAudioButton', jhIgnoreAudioButton);

  function jhIgnoreAudioButton() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/buttons/jh-ignore-audio-button.html',
      scope: {
        feed: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhIgnoreAudioButtonCtrl
    };

    function JhIgnoreAudioButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.toggle = toggle;
      vm.showsIgnore =showsIgnore;
      vm.showsStopIgnoring = showsStopIgnoring;

      function toggle() {
        vm.feed.setEnabledTrack("audio", !vm.feed.isTrackEnabled("audio"));
      }

      function showsIgnore() {
        return (isRelevant() && vm.feed.isTrackEnabled("audio"));
      }

      function showsStopIgnoring() {
        return (isRelevant() && !vm.feed.isTrackEnabled("audio"));
      }

      function isRelevant() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored && vm.feed.hasTrack("audio"));
      }
    }
  }
})();
