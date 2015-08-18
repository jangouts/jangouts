/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhMainFeed', jhMainFeedDirective);

  function jhMainFeedDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/jh-main-feed.html',
      scope: {
        feed: '=',
        message: '@'
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhMainFeedCtrl,
      link: jhMainFeedLink,
    };

    function jhMainFeedLink(scope, element) {
      scope.$watch('vm.feed.stream', function(newVal) {
        if (newVal !== undefined) {
          var video = $('video', element)[0];
          video.muted = true;
          attachMediaStream(video, newVal);
        }
      });
    }

    function JhMainFeedCtrl() {} 
  }
})();
