(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  function jhFeed() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-feed.html',
      scope: {
        feed: '=',
        clickFn: '&',
        highlighted: '='
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
        video.muted = scope.vm.feed.isPublisher;
        attachMediaStream(video, newVal);
      }
    });
  }

  function JhFeedCtrl() {
    /* jshint: validthis */
    var vm = this;
    vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);
    vm.toggleAudio = toggleAudio;
    vm.toggleVideo = toggleVideo;
    vm.isVideoVisible = isVideoVisible;
    vm.showsEnableAudio = showsEnableAudio;
    vm.showsDisableAudio = showsDisableAudio;
    vm.showsAudioOff = showsAudioOff;
    vm.showsEnableVideo =showsEnableVideo;
    vm.showsDisableVideo = showsDisableVideo;

    function toggleAudio() {
      if (vm.feed.audioEnabled) {
        vm.feed.setEnabledTrack("audio", false);
      } else {
        vm.feed.setEnabledTrack("audio", true);
      }
    }

    function toggleVideo() {
      if (vm.feed.videoEnabled) {
        vm.feed.setEnabledTrack("video", false);
      } else {
        vm.feed.setEnabledTrack("video", true);
      }
    }

    function isVideoVisible() {
      return (vm.feed.videoEnabled && vm.feed.hasVideo());
    }

    function showsEnableAudio() {
      return (vm.feed.isPublisher && vm.feed.hasAudio() && !vm.feed.audioEnabled);
    }

    function showsDisableAudio() {
      return (vm.feed.audioEnabled && vm.feed.hasAudio());
    }

    function showsAudioOff() {
      return (!vm.feed.isPublisher && vm.feed.hasAudio && vm.feed.hasAudio() && !vm.feed.audioEnabled);
    }

    function showsEnableVideo() {
      return (vm.feed.isPublisher && vm.feed.hasVideo() && !vm.feed.videoEnabled);
    }

    function showsDisableVideo() {
      return (vm.feed.isPublisher && vm.feed.hasVideo() && vm.feed.videoEnabled);
    }
  }
})();
