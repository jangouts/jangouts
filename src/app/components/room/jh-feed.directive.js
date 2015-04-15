(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  function jhFeed() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/room/jh-feed.html',
      scope: {
        feed: '=',
        clickFn: '&'
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhFeedCtrl,
      link: jhFeedLink,
    };
  }

  function jhFeedLink(scope, element, attrs) {
    scope.$watch('vm.feed.stream', function(newVal) {
      if (newVal !== undefined) {
        var video = $('video', element)[0];
        // Mute video of the local stream
        video.muted = (scope.vm.feed.id === 0);
        attachMediaStream(video, newVal);
      }
    });
  }

  function JhFeedCtrl() {
    /* jshint: validthis */
    var vm = this;

    vm.toggleAudio = function() {
      if (vm.feed.audioEnabled) {
        vm.feed.setEnabledTrack("audio", false);
      } else {
        vm.feed.setEnabledTrack("audio", true);
      }
    }

    vm.toggleVideo = function() {
      if (vm.feed.videoEnabled) {
        vm.feed.setEnabledTrack("video", false);
      } else {
        vm.feed.setEnabledTrack("video", true);
      }
    }
  }
})();
