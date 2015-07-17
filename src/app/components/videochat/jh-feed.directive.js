/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  jhFeed.$inject = ['RoomService', '$interval', 'jhConfig'];

  function jhFeed(RoomService, $interval, jhConfig) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-feed.html',
      scope: {
        feed: '=',
        clickFn: '&',
        highlighted: '=',
        highlightedByUser: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhFeedCtrl,
      link: jhFeedLink,
    };

    function jhFeedLink(scope, element) {
      scope.$watch('vm.feed.stream', function(newVal) {
        if (newVal !== undefined) {
          var video = $('video', element)[0];
          // Mute video of the local stream
          video.muted = scope.vm.feed.isPublisher;
          attachMediaStream(video, newVal);
        }
      });

      if (!scope.vm.feed.isPublisher) {
        scope.$watch('vm.feed.isSilent(6000)', function(silent) {
          var video = scope.vm.feed.highlighted || !silent || jhConfig.videoThumbnails;
          scope.vm.feed.configure({"video": video});
        });
      }

      if (scope.vm.feed.isPublisher) {
        scope.vm.initPics(element);
        scope.vm.takePic();
        $interval(scope.vm.takePic, 5000);
      }
    }

    function JhFeedCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);
      vm.toggleAudio = toggleAudio;
      vm.toggleVideo = toggleVideo;
      vm.thumbnailTag = thumbnailTag;
      vm.showsEnableAudio = showsEnableAudio;
      vm.showsDisableAudio = showsDisableAudio;
      vm.showsAudioOff = showsAudioOff;
      vm.showsEnableVideo =showsEnableVideo;
      vm.showsDisableVideo = showsDisableVideo;
      vm.unPublish = unPublish;
      vm.showsUnPublish = showsUnPublish;
      vm.ignore = ignore;
      vm.stopIgnoring = stopIgnoring;
      vm.showsIgnore = showsIgnore;
      vm.showsStopIgnoring = showsStopIgnoring;
      vm.initPics = initPics;
      vm.takePic = takePic;

      function toggleAudio() {
        RoomService.toggleChannel("audio", vm.feed);
      }

      function toggleVideo() {
        RoomService.toggleChannel("video", vm.feed);
      }

      function unPublish() {
        RoomService.unPublishFeed(vm.feed.id);
      }

      function showsUnPublish() {
        return (vm.feed.isPublisher && vm.feed.isLocalScreen);
      }

      function thumbnailTag() {
        if (vm.highlighted || vm.feed.isIgnored) { return "placeholder"; }
        if (!vm.feed.videoEnabled) { return "placeholder"; }
        if (vm.feed.isPublisher) { return "video"; }

        if (jhConfig.videoThumbnails || vm.feed.speaking) {
          return "video";
        } else {
          if (vm.feed.picture) {
            return "picture";
          } else {
            return "placeholder";
          }
        }
      }

      function showsEnableAudio() {
        return (vm.feed.isPublisher && !vm.feed.audioEnabled);
      }

      function showsDisableAudio() {
        return (!vm.feed.isIgnored && vm.feed.audioEnabled);
      }

      function showsAudioOff() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored && !vm.feed.audioEnabled);
      }

      function showsEnableVideo() {
        return (vm.feed.isPublisher && !vm.feed.videoEnabled);
      }

      function showsDisableVideo() {
        return (vm.feed.isPublisher && vm.feed.videoEnabled);
      }

      function ignore() {
        RoomService.ignoreFeed(vm.feed.id);
      }

      function showsIgnore() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored);
      }

      function stopIgnoring() {
        RoomService.stopIgnoringFeed(vm.feed.id);
      }

      function showsStopIgnoring() {
        return vm.feed.isIgnored;
      }

      function initPics(element) {
        var canvas = $('canvas', element);
        var canvasTag = canvas[0];
        var video = $('video', element).first();
        var context = canvasTag.getContext('2d');

        // Initially set it to 4:3 (fitting the placeholder image)
        canvasTag.width = canvas.width();
        canvasTag.height = Math.round(canvasTag.width * 0.75);

        var placeholder = new Image();
        placeholder.src = "assets/images/placeholder.png";
        placeholder.onload = function() {
          context.drawImage(placeholder, 0, 0, canvasTag.width, canvasTag.height);
        };

        vm.picCanvas = canvas;
        vm.picSource = video;
        vm.picContext = context;
      }

      function takePic() {
        var canvas = vm.picCanvas[0];
        var width = canvas.width;
        // Skip the rest if the video has no dimensions yet
        if (vm.picSource[0].videoHeight) {
          var height = width * vm.picSource[0].videoHeight / vm.picSource[0].videoWidth;
          canvas.height = height;
          vm.picContext.drawImage(vm.picSource[0], 0, 0, width, height);
          vm.feed.updatePic(canvas.toDataURL('image/jpeg',0.4));
        }
      }
    }
  }
})();
