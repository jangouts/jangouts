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
        video.muted = scope.vm.feed.isPublisher;
        attachMediaStream(video, newVal);
      }
    });
  }

  function JhFeedCtrl() {
    /* jshint: validthis */
    var vm = this;
    vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);

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

    vm.isVideoVisible = function() {
      return (vm.feed.videoEnabled && vm.feed.hasVideo());
    }
    vm.showsEnableAudio = function() {
      return (vm.feed.isPublisher && vm.feed.hasAudio() && !vm.feed.audioEnabled);
    }
    vm.showsDisableAudio = function() {
      return (vm.feed.audioEnabled && vm.feed.hasAudio());
    }
    vm.showsAudioOff = function() {
      return (!vm.feed.isPublisher && vm.feed.hasAudio && vm.feed.hasAudio() && !vm.feed.audioEnabled);
    }
    vm.showsEnableVideo = function() {
      return (vm.feed.isPublisher && vm.feed.hasVideo() && !vm.feed.videoEnabled);
    }
    vm.showsDisableVideo = function() {
      return (vm.feed.isPublisher && vm.feed.hasVideo() && vm.feed.videoEnabled);
    }
  }
})();
